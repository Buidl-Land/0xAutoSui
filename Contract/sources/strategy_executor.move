module automcp::strategy_executor {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use automcp::smart_wallet::{Self, SmartWallet};
    use automcp::points_manager::{Self, PointsManager};

    // 错误码
    const ENotAuthorized: u64 = 1;
    const EInvalidStrategy: u64 = 2;
    const EInsufficientPoints: u64 = 3;
    const EStrategyNotFound: u64 = 4;
    const EStrategyDisabled: u64 = 5;

    // 事件
    struct StrategyExecuted has copy, drop {
        wallet_id: ID,
        strategy_id: u64,
        points_used: u64,
        timestamp: u64
    }

    struct StrategyAdded has copy, drop {
        strategy_id: u64,
        name: vector<u8>,
        points_cost: u64
    }

    struct StrategyRemoved has copy, drop {
        strategy_id: u64
    }

    struct StrategyEnabled has copy, drop {
        strategy_id: u64,
        enabled: bool
    }

    // 策略结构
    struct Strategy has store {
        id: u64,
        name: vector<u8>,
        points_cost: u64,
        enabled: bool,
        last_executed: u64,
        execution_count: u64
    }

    // 策略执行器
    struct StrategyExecutor has key {
        id: UID,
        strategies: Table<u64, Strategy>,
        next_strategy_id: u64,
        authorized_relayers: VecMap<address, bool>,
        admin: address
    }

    // 创建策略执行器
    public entry fun init(ctx: &mut TxContext) {
        let executor = StrategyExecutor {
            id: object::new(ctx),
            strategies: table::new(ctx),
            next_strategy_id: 1,
            authorized_relayers: vec_map::empty(),
            admin: tx_context::sender(ctx)
        };
        transfer::share_object(executor);
    }

    // 添加授权中继器
    public entry fun add_relayer(executor: &mut StrategyExecutor, relayer: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == executor.admin, ENotAuthorized);
        vec_map::insert(&mut executor.authorized_relayers, relayer, true);
    }

    // 移除授权中继器
    public entry fun remove_relayer(executor: &mut StrategyExecutor, relayer: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == executor.admin, ENotAuthorized);
        vec_map::remove(&mut executor.authorized_relayers, &relayer);
    }

    // 添加策略
    public entry fun add_strategy(
        executor: &mut StrategyExecutor,
        name: vector<u8>,
        points_cost: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == executor.admin, ENotAuthorized);
        assert!(points_cost > 0, EInvalidStrategy);

        let strategy = Strategy {
            id: executor.next_strategy_id,
            name,
            points_cost,
            enabled: true,
            last_executed: 0,
            execution_count: 0
        };

        table::add(&mut executor.strategies, strategy.id, strategy);
        executor.next_strategy_id = executor.next_strategy_id + 1;

        event::emit(StrategyAdded {
            strategy_id: strategy.id,
            name: strategy.name,
            points_cost: strategy.points_cost
        });
    }

    // 移除策略
    public entry fun remove_strategy(
        executor: &mut StrategyExecutor,
        strategy_id: u64,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == executor.admin, ENotAuthorized);
        assert!(table::contains(&executor.strategies, &strategy_id), EStrategyNotFound);

        table::remove(&mut executor.strategies, strategy_id);

        event::emit(StrategyRemoved {
            strategy_id
        });
    }

    // 启用/禁用策略
    public entry fun set_strategy_enabled(
        executor: &mut StrategyExecutor,
        strategy_id: u64,
        enabled: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == executor.admin, ENotAuthorized);
        assert!(table::contains(&executor.strategies, &strategy_id), EStrategyNotFound);

        let strategy = table::borrow_mut(&mut executor.strategies, &strategy_id);
        strategy.enabled = enabled;

        event::emit(StrategyEnabled {
            strategy_id,
            enabled
        });
    }

    // 执行策略
    public entry fun execute_strategy(
        executor: &mut StrategyExecutor,
        wallet: &mut SmartWallet,
        points_manager: &mut PointsManager,
        strategy_id: u64,
        ctx: &mut TxContext
    ) {
        assert!(vec_map::contains(&executor.authorized_relayers, &tx_context::sender(ctx)), ENotAuthorized);
        assert!(table::contains(&executor.strategies, &strategy_id), EStrategyNotFound);

        let strategy = table::borrow_mut(&mut executor.strategies, &strategy_id);
        assert!(strategy.enabled, EStrategyDisabled);

        let points_balance = smart_wallet::get_points_balance(wallet);
        assert!(points_balance >= strategy.points_cost, EInsufficientPoints);

        // 扣除点数
        smart_wallet::deduct_points(wallet, strategy.points_cost, ctx);
        points_manager::burn_points(points_manager, wallet, strategy.points_cost, ctx);

        // 更新策略执行信息
        strategy.last_executed = tx_context::epoch(ctx);
        strategy.execution_count = strategy.execution_count + 1;

        // TODO: 在这里实现具体的策略逻辑
        // 例如：调用其他合约执行交易、更新状态等

        event::emit(StrategyExecuted {
            wallet_id: object::id(wallet),
            strategy_id,
            points_used: strategy.points_cost,
            timestamp: strategy.last_executed
        });
    }

    // 查询策略信息
    public fun get_strategy(executor: &StrategyExecutor, strategy_id: u64): (vector<u8>, u64, bool, u64, u64) {
        assert!(table::contains(&executor.strategies, &strategy_id), EStrategyNotFound);
        let strategy = table::borrow(&executor.strategies, &strategy_id);
        (strategy.name, strategy.points_cost, strategy.enabled, strategy.last_executed, strategy.execution_count)
    }

    // 检查中继器是否授权
    public fun is_relayer_authorized(executor: &StrategyExecutor, relayer: address): bool {
        vec_map::contains(&executor.authorized_relayers, &relayer)
    }

    // 获取管理员地址
    public fun get_admin(executor: &StrategyExecutor): address {
        executor.admin
    }
} 