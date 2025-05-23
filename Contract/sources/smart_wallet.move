module automcp::smart_wallet {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};

    // 错误码
    const ENotAuthorized: u64 = 1;
    const EInsufficientPoints: u64 = 2;
    const EInvalidAmount: u64 = 3;

    // 事件
    struct WalletCreated has copy, drop {
        wallet_id: ID,
        owner: address
    }

    struct PointsDeducted has copy, drop {
        wallet_id: ID,
        amount: u64
    }

    struct PointsAdded has copy, drop {
        wallet_id: ID,
        amount: u64
    }

    // 钱包结构
    struct SmartWallet has key {
        id: UID,
        owner: address,
        points_balance: u64,
        spending_limits: VecMap<u64, u64>, // 每日/每月限额
        authorized_relayers: VecMap<address, bool>,
        created_at: u64
    }

    // 创建新钱包
    public entry fun create_wallet(ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        let wallet = SmartWallet {
            id: object::new(ctx),
            owner: sender,
            points_balance: 0,
            spending_limits: vec_map::empty(),
            authorized_relayers: vec_map::empty(),
            created_at: tx_context::epoch(ctx)
        };

        let wallet_id = object::id(&wallet);
        transfer::share_object(wallet);
        
        event::emit(WalletCreated {
            wallet_id,
            owner: sender
        });
    }

    // 添加点数
    public entry fun add_points(wallet: &mut SmartWallet, amount: u64, ctx: &mut TxContext) {
        assert!(amount > 0, EInvalidAmount);
        wallet.points_balance = wallet.points_balance + amount;
        
        event::emit(PointsAdded {
            wallet_id: object::id(wallet),
            amount
        });
    }

    // 扣除点数
    public entry fun deduct_points(wallet: &mut SmartWallet, amount: u64, ctx: &mut TxContext) {
        assert!(amount > 0, EInvalidAmount);
        assert!(wallet.points_balance >= amount, EInsufficientPoints);
        
        wallet.points_balance = wallet.points_balance - amount;
        
        event::emit(PointsDeducted {
            wallet_id: object::id(wallet),
            amount
        });
    }

    // 设置支出限额
    public entry fun set_spending_limit(wallet: &mut SmartWallet, period: u64, limit: u64, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == wallet.owner, ENotAuthorized);
        vec_map::insert(&mut wallet.spending_limits, period, limit);
    }

    // 添加授权中继器
    public entry fun add_relayer(wallet: &mut SmartWallet, relayer: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == wallet.owner, ENotAuthorized);
        vec_map::insert(&mut wallet.authorized_relayers, relayer, true);
    }

    // 移除授权中继器
    public entry fun remove_relayer(wallet: &mut SmartWallet, relayer: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == wallet.owner, ENotAuthorized);
        vec_map::remove(&mut wallet.authorized_relayers, &relayer);
    }

    // 查询点数余额
    public fun get_points_balance(wallet: &SmartWallet): u64 {
        wallet.points_balance
    }

    // 查询支出限额
    public fun get_spending_limit(wallet: &SmartWallet, period: u64): u64 {
        if (vec_map::contains(&wallet.spending_limits, &period)) {
            *vec_map::get(&wallet.spending_limits, &period)
        } else {
            0
        }
    }

    // 检查中继器是否授权
    public fun is_relayer_authorized(wallet: &SmartWallet, relayer: address): bool {
        vec_map::contains(&wallet.authorized_relayers, &relayer)
    }
} 