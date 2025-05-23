module automcp::points_manager {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::vec_map::{Self, VecMap};
    use automcp::smart_wallet::{Self, SmartWallet};

    // 错误码
    const ENotAuthorized: u64 = 1;
    const EInvalidAmount: u64 = 2;
    const EWalletNotFound: u64 = 3;

    // 事件
    struct PointsIssued has copy, drop {
        amount: u64,
        to: address
    }

    struct PointsBurned has copy, drop {
        amount: u64,
        from: address
    }

    // 点数管理器
    struct PointsManager has key {
        id: UID,
        total_supply: u64,
        wallet_points: Table<address, u64>,
        authorized_issuers: VecMap<address, bool>
    }

    // 创建点数管理器
    fun init(ctx: &mut TxContext) {
        let manager = PointsManager {
            id: object::new(ctx),
            total_supply: 0,
            wallet_points: table::new(ctx),
            authorized_issuers: vec_map::empty()
        };
        transfer::share_object(manager);
    }

    // 添加授权发行者
    public entry fun add_issuer(manager: &mut PointsManager, issuer: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == tx_context::sender(ctx), ENotAuthorized);
        vec_map::insert(&mut manager.authorized_issuers, issuer, true);
    }

    // 移除授权发行者
    public entry fun remove_issuer(manager: &mut PointsManager, issuer: address, ctx: &mut TxContext) {
        assert!(tx_context::sender(ctx) == tx_context::sender(ctx), ENotAuthorized);
        vec_map::remove(&mut manager.authorized_issuers, &issuer);
    }

    // 发行点数
    public entry fun issue_points(
        manager: &mut PointsManager,
        wallet: &mut SmartWallet,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        assert!(vec_map::contains(&manager.authorized_issuers, &tx_context::sender(ctx)), ENotAuthorized);

        let owner = smart_wallet::get_owner(wallet);
        let current_balance = if (table::contains(&manager.wallet_points, &owner)) {
            *table::borrow(&manager.wallet_points, &owner)
        } else {
            0
        };

        table::add(&mut manager.wallet_points, owner, current_balance + amount);
        manager.total_supply = manager.total_supply + amount;

        smart_wallet::add_points(wallet, amount, ctx);

        event::emit(PointsIssued {
            amount,
            to: owner
        });
    }

    // 销毁点数
    public entry fun burn_points(
        manager: &mut PointsManager,
        wallet: &mut SmartWallet,
        amount: u64,
        ctx: &mut TxContext
    ) {
        assert!(amount > 0, EInvalidAmount);
        let owner = smart_wallet::get_owner(wallet);
        assert!(table::contains(&manager.wallet_points, &owner), EWalletNotFound);

        let current_balance = *table::borrow(&manager.wallet_points, &owner);
        assert!(current_balance >= amount, EInvalidAmount);

        table::add(&mut manager.wallet_points, owner, current_balance - amount);
        manager.total_supply = manager.total_supply - amount;

        smart_wallet::deduct_points(wallet, amount, ctx);

        event::emit(PointsBurned {
            amount,
            from: owner
        });
    }

    // 查询点数余额
    public fun get_points_balance(manager: &PointsManager, address: address): u64 {
        if (table::contains(&manager.wallet_points, &address)) {
            *table::borrow(&manager.wallet_points, &address)
        } else {
            0
        }
    }

    // 查询总供应量
    public fun get_total_supply(manager: &PointsManager): u64 {
        manager.total_supply
    }
} 