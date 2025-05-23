module automcp::pool {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use automcp::smart_wallet::{Self, SmartWallet};

    // 错误码
    const ENotAuthorized: u64 = 1;
    const EInsufficientBalance: u64 = 2;
    const EInvalidAmount: u64 = 3;
    const EWalletNotFound: u64 = 4;

    // 事件
    struct DepositEvent has copy, drop {
        from: address,
        amount: u64
    }

    struct WithdrawEvent has copy, drop {
        to: address,
        amount: u64
    }

    struct TransferEvent has copy, drop {
        from: address,
        to: address,
        amount: u64
    }

    // 资金池
    struct Pool has key {
        id: UID,
        balances: Table<address, Balance<SUI>>,
        authorized_operators: VecMap<address, bool>,
        total_deposits: u64
    }

    // 创建资金池
    fun init(ctx: &mut TxContext) {
        let pool = Pool {
            id: object::new(ctx),
            balances: table::new(ctx),
            authorized_operators: vec_map::empty(),
            total_deposits: 0
        };
        transfer::share_object(pool);
    }

    // 添加授权操作者
    public entry fun add_operator(pool: &mut Pool, operator: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == tx_context::sender(ctx), ENotAuthorized);
        vec_map::insert(&mut pool.authorized_operators, operator, true);
    }

    // 移除授权操作者
    public entry fun remove_operator(pool: &mut Pool, operator: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == tx_context::sender(ctx), ENotAuthorized);
        vec_map::remove(&mut pool.authorized_operators, &operator);
    }

    // 存款
    public entry fun deposit(
        pool: &mut Pool,
        coin: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let amount = coin::value(&coin);
        assert!(amount > 0, EInvalidAmount);

        let balance = coin::into_balance(coin);
        if (table::contains(&pool.balances, &sender)) {
            let current_balance = table::borrow_mut(&mut pool.balances, &sender);
            balance::join(current_balance, balance);
        } else {
            table::add(&mut pool.balances, sender, balance);
        };

        pool.total_deposits = pool.total_deposits + amount;

        event::emit(DepositEvent {
            from: sender,
            amount
        });
    }

    // 提款
    public entry fun withdraw(
        pool: &mut Pool,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(amount > 0, EInvalidAmount);
        assert!(table::contains(&pool.balances, &sender), EWalletNotFound);

        let balance = table::borrow_mut(&mut pool.balances, &sender);
        assert!(balance::value(balance) >= amount, EInsufficientBalance);

        let coins = coin::from_balance(balance::split(balance, amount), ctx);
        transfer::transfer(coins, sender);

        pool.total_deposits = pool.total_deposits - amount;

        event::emit(WithdrawEvent {
            to: sender,
            amount
        });
    }

    // 转账到智能钱包
    public entry fun transfer_to_wallet(
        pool: &mut Pool,
        wallet: &mut SmartWallet,
        amount: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        assert!(amount > 0, EInvalidAmount);
        assert!(table::contains(&pool.balances, &sender), EWalletNotFound);
        assert!(vec_map::contains(&pool.authorized_operators, &sender), ENotAuthorized);

        let balance = table::borrow_mut(&mut pool.balances, &sender);
        assert!(balance::value(balance) >= amount, EInsufficientBalance);

        let coins = coin::from_balance(balance::split(balance, amount), ctx);
        let wallet_owner = smart_wallet::get_owner(wallet);
        transfer::transfer(coins, wallet_owner);

        pool.total_deposits = pool.total_deposits - amount;

        event::emit(TransferEvent {
            from: sender,
            to: wallet_owner,
            amount
        });
    }

    // 查询余额
    public fun get_balance(pool: &Pool, address: address): u64 {
        if (table::contains(&pool.balances, &address)) {
            balance::value(table::borrow(&pool.balances, &address))
        } else {
            0
        }
    }

    // 查询总存款
    public fun get_total_deposits(pool: &Pool): u64 {
        pool.total_deposits
    }
} 