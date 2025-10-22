/**
 * 团队成员 (Team Member)
 *
 * 隶属于某个 `商家` 的、可登录的操作账户。
 *
 */
export interface ITeamMember {
  /**
   * 成员唯一标识符
   *
   */
  id: string;

  /**
   * 所属商家 ID
   *
   */
  merchantId: string;

  /**
   * 成员姓名
   *
   */
  name: string;

  /**
   * 登录手机号 (唯一)
   *
   */
  phone: string;

  /**
   * 密码哈希 - 通常不在前端模型中直接使用，但定义在此以保持完整性
   * (后端返回用户信息时不应包含此字段)
   *
   */
  // passwordHash?: string;

  /**
   * 成员角色
   * 决定了其在商户端的访问权限。
   * - 角色与权限体系 (RBAC)
   */
  role: "Administrator" | "Operator" | "Practitioner";

  /**
   * 绑定的微信 OpenID (用户授权绑定后才有值)
   *
   */
  wechatOpenId?: string | null;

  /**
   * 用户状态机，用于驱动 Onboarding 流程和访问控制
   * PENDING_PASSWORD: 临时密码登录，需设置新密码
   * PENDING_WECHAT: 已设密码，需绑定微信
   * PENDING_SETUP: 已绑微信，需完成三步引导
   * ACTIVE: 正常可用状态
   */
  status: "PENDING_PASSWORD" | "PENDING_WECHAT" | "PENDING_SETUP" | "ACTIVE";

  /**
   * 头像 URL (可选)
   * (虽然 core.md 未明确列出，但 UserNav 组件需要)
   */
  avatarUrl?: string | null;

  /**
   * 账户创建时间 (ISO 8601 格式)
   */
  createdAt: string;

  /**
   * 账户最后更新时间 (ISO 8601 格式)
   */
  updatedAt: string;
}

/**
 * 服务项目状态
 *
 */
export type ServiceStatus = "Enabled" | "Disabled";

/**
 * 服务项目 (Service)
 *
 * `商家` 提供给 `会员` 的具体服务产品。
 *,
 */
export interface IService {
  /**
   * 服务项目唯一标识符
   *
   */
  id: string;

  /**
   * 所属店铺 ID (在 MVP 中等于所属商家 ID)
   *
   */
  shopId: string;

  /**
   * 服务项目名称
   *,
   */
  name: string;

  /**
   * 服务价格 (以分为单位存储，避免浮点数问题，或者使用 Decimal 类型库)
   *,
   */
  price: number; // 以分为单位

  /**
   * 核心服务时长 (分钟)
   *,
   */
  duration: number;

  /**
   * 服务前准备时间 (分钟, 可选)
   *,
   */
  bufferBefore?: number | null;

  /**
   * 服务后清理时间 (分钟, 可选)
   *,
   */
  bufferAfter?: number | null;

  /**
   * 服务介绍 (可选)
   *,
   */
  description?: string | null;

  /**
   * 是否允许顾客在线自助预约
   *,
   */
  onlineBookingEnabled: boolean;

  /**
   * 服务项目状态 ('Enabled' 或 'Disabled')
   *,
   */
  status: ServiceStatus;

  /**
   * 手动排序的顺序值 (整数)
   *,
   */
  sortOrder: number;

  /**
   * 可提供此服务的员工 ID 列表
   *,
   */
  assignableStaffIds: string[];

  /**
   * 服务创建时间 (ISO 8601 格式)
   */
  createdAt: string;

  /**
   * 服务最后更新时间 (ISO 8601 格式)
   */
  updatedAt: string;
}

/**
 * 会员状态
 * Active: 活跃会员
 * Archived: 已归档会员
 *
 */
export type MemberStatus = "Active" | "Archived";

/**
 * 会员来源
 * Manual: 手动录入 或 批量导入
 * Online: 线上小程序预约自动注册
 *
 */
export type MemberSource = "Manual" | "Online";

/**
 * 会员 (Member)
 *
 * `商家` 的客户关系管理（CRM）资产。
 *,
 */
export interface IMember {
  /**
   * 会员唯一标识符
   *
   */
  id: string;

  /**
   * 所属商家 ID
   *
   */
  merchantId: string;

  /**
   * 会员姓名 (必填)
   *,
   */
  name: string;

  /**
   * 会员手机号 (在活跃状态下应唯一且必填)
   *,
   */
  phone: string;

  /**
   * 关联的顾客身份 ID (Customer Profile ID)
   * 如果会员是通过小程序注册或后续绑定了微信，则此字段有值。
   * 手动录入的会员此字段可能为空。
   *,
   */
  customerProfileId?: string | null;

  /**
   * 会员备注 (可选)
   *
   */
  remarks?: string | null;

  /**
   * 会员状态 ('Active' 或 'Archived')
   *
   */
  status: MemberStatus;

  /**
   * 会员来源 ('Manual' 或 'Online')
   *
   */
  source: MemberSource;

  /**
   * 累计消费金额 (以分为单位) - 通常由后端计算提供，前端只读
   *
   */
  readonly totalConsumptionAmount?: number; // 只读属性

  /**
   * 未到店 (No-Show) 次数 - 通常由后端计算提供，前端只读
   *
   */
  readonly noShowCount?: number; // 只读属性

  /**
   * 会员档案创建时间 (ISO 8601 格式)
   */
  createdAt: string;

  /**
   * 会员档案最后更新时间 (ISO 8601 格式)
   */
  updatedAt: string;
}


好的，我们继续定义核心数据模型。

接下来是 IAppointment (预约单) 接口。这是连接会员、服务项目和团队成员的核心业务单据。

[阶段 2: 组件实现 (续)]

我将在 /src/types/models.ts 文件中追加 IAppointment 接口的定义。

Why (为什么这么做?)

PRD 对齐 (core.md): 接口字段严格基于 pd/mvp/core.md 中对 预约单 (Appointment) 的定义：“预约ID, 所属店铺ID, 关联会员ID, 关联服务项目ID, 关联团队成员ID, 预约时间, 状态”。

PRD 对齐 (Appointments.md): 我们进一步参考了 pd/mvp/预约管理 (Appointments).md 来细化字段：

定义了 AppointmentStatus 类型，包含了 PRD 中提到的所有状态：“待确认”、“已确认”、“已完成”、“已取消”、“未到店 (No-Show)”。

加入了 startTime 和 endTime 来明确预约的时间段。

加入了 remarks (预约备注)，对应手动创建预约时的可选字段。

加入了 cancellationReason 和 cancelledBy，对应 PRD 中取消预约时需要记录原因和责任方的要求。

加入了 serviceSnapshot，用于存储服务项目在预约创建时的“快照”信息（价格、时长），严格遵循 PRD 中的“数据一致性与快照规则”。

注释: 添加了 JSDoc 注释。

Code snippet

/**
 * 规范：类型/接口 命名，大驼峰并以 I 开头
 */

/**
 * 团队成员 (Team Member)
 *
 */
export interface ITeamMember {
  id: string;
  merchantId: string;
  name: string;
  phone: string;
  // passwordHash?: string;
  role: 'Administrator' | 'Operator' | 'Practitioner';
  wechatOpenId?: string | null;
  status: 'PENDING_PASSWORD' | 'PENDING_WECHAT' | 'PENDING_SETUP' | 'ACTIVE';
  avatarUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * 服务项目状态
 *
 */
export type ServiceStatus = 'Enabled' | 'Disabled';

/**
 * 服务项目 (Service)
 *,
 */
export interface IService {
  id: string;
  shopId: string;
  name: string;
  price: number; // 假设以分为单位
  duration: number;
  bufferBefore?: number | null;
  bufferAfter?: number | null;
  description?: string | null;
  onlineBookingEnabled: boolean;
  status: ServiceStatus;
  sortOrder: number;
  assignableStaffIds: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 会员状态
 *
 */
export type MemberStatus = 'Active' | 'Archived';

/**
 * 会员来源
 *
 */
export type MemberSource = 'Manual' | 'Online';

/**
 * 会员 (Member)
 *,
 */
export interface IMember {
  id: string;
  merchantId: string;
  name: string;
  phone: string;
  customerProfileId?: string | null;
  remarks?: string | null;
  status: MemberStatus;
  source: MemberSource;
  readonly totalConsumptionAmount?: number;
  readonly noShowCount?: number;
  createdAt: string;
  updatedAt: string;
}

// --- 新增内容 开始 ---

/**
 * 预约单状态
 * PendingConfirmation: 待商家确认 (线上新预约)
 * Confirmed: 已确认 (商家已接单 或 手动创建的预约)
 * Completed: 已完成 (服务完成且已结算)
 * Cancelled: 已取消 (顾客或商家取消)
 * NoShow: 未到店 (顾客爽约)
 * - 组件三 & 核心业务规则
 */
export type AppointmentStatus =
  | 'PendingConfirmation'
  | 'Confirmed'
  | 'Completed'
  | 'Cancelled'
  | 'NoShow';

/**
 * 取消原因 (示例)
 * - 组件三
 */
export type CancellationReason =
  | 'CustomerRequest' // 顾客要求取消
  | 'MerchantAdjustment' // 商家原因调整
  | 'Other'; // 其他

/**
 * 服务项目快照
 * 用于在预约创建时固化服务的关键信息，防止后续服务项目修改影响历史预约。
 * - 数据一致性与快照规则
 */
export interface IServiceSnapshot {
  /**
   * 快照时服务项目的 ID
   */
  serviceId: string;
  /**
   * 快照时服务项目的名称
   */
  name: string;
  /**
   * 快照时服务项目的价格 (以分为单位)
   */
  price: number;
  /**
   * 快照时服务项目的核心时长 (分钟)
   */
  duration: number;
  /**
   * 快照时服务项目的准备时长 (分钟)
   */
  bufferBefore?: number | null;
   /**
   * 快照时服务项目的清理时长 (分钟)
   */
  bufferAfter?: number | null;
}


/**
 * 预约单 (Appointment)
 *
 * 连接 `会员`、`服务项目` 和 `团队成员` 的核心业务单据。
 *,
 */
export interface IAppointment {
  /**
   * 预约唯一标识符
   *
   */
  id: string;

  /**
   * 所属店铺 ID
   *
   */
  shopId: string; // 在 MVP 中等于 merchantId

  /**
   * 关联的会员 ID
   *
   */
  memberId: string;

  /**
   * 关联的服务项目 ID
   * (注意：具体的价格、时长信息应从 serviceSnapshot 读取)
   *
   */
  serviceId: string;

  /**
   * 关联的服务项目快照
   * 存储了预约创建时服务的价格、时长等关键信息。
   * - 数据一致性与快照规则
   */
  serviceSnapshot: IServiceSnapshot;

  /**
   * 关联的团队成员 (服务人员) ID
   *
   */
  teamMemberId: string;

  /**
   * 预约开始时间 (ISO 8601 格式)
   *
   */
  startTime: string;

  /**
   * 预约结束时间 (ISO 8601 格式)
   * (通常由 startTime + serviceSnapshot.duration + buffers 计算得出)
   */
  endTime: string;

  /**
   * 预约状态
   *,
   */
  status: AppointmentStatus;

  /**
   * 预约备注 (可选, 手动创建时填写)
   * - 组件四
   */
  remarks?: string | null;

  /**
   * 取消原因 (仅当 status 为 'Cancelled' 时有值)
   * - 组件三
   */
  cancellationReason?: CancellationReason | null;

  /**
   * 取消操作者的类型 ('Customer', 'Merchant') 或具体团队成员 ID
   * (仅当 status 为 'Cancelled' 时有值)
   * - 核心业务规则 (记录操作者)
   */
  cancelledBy?: 'Customer' | 'Merchant' | string | null;

   /**
   * 自定义取消原因文本 (当 cancellationReason 为 'Other' 时填写)
   * - 组件三
   */
  cancellationNote?: string | null;

  /**
   * 关联的交易单 ID (仅当 status 为 'Completed' 时有值)
   * - 订单（交易单）业务逻辑
   */
  transactionId?: string | null;

  /**
   * 预约创建时间 (ISO 8601 格式)
   */
  createdAt: string;

  /**
   * 预约最后更新时间 (ISO 8601 格式)
   */
  updatedAt: string;
}



/**
 * 交易类型
 * ServiceConsumption: 服务消费 (预约结算)
 * CardPurchase: 卡券购买 (办理新卡)
 * CardRecharge: 卡券充值 (为储值卡充值)
 * - 订单（交易单）业务逻辑
 */
export type TransactionType =
  | 'ServiceConsumption'
  | 'CardPurchase'
  | 'CardRecharge';

/**
 * 支付方式 (MVP 阶段)
 * Cash: 现金
 * ValueCard: 储值卡抵扣
 * CountCard: 次卡核销
 * - 页面五 & 订单（交易单）业务逻辑
 */
export type PaymentMethod = 'Cash' | 'ValueCard' | 'CountCard';

/**
 * 交易单 (Transaction)
 *
 * 记录商家所有收入的核心财务模型，不可篡改。
 *,
 */
export interface ITransaction {
  /**
   * 交易唯一标识符
   *
   */
  id: string;

  /**
   * 所属店铺 ID
   *
   */
  shopId: string;

  /**
   * 关联的会员 ID
   *
   */
  memberId: string;

  /**
   * 交易类型
   *,
   */
  type: TransactionType;

  /**
   * 交易金额 (以分为单位)
   * 对于服务消费，通常是 serviceSnapshot.price
   * 对于购卡/充值，是实收金额
   *
   */
  amount: number;

  /**
   * 支付方式
   *,
   */
  paymentMethod: PaymentMethod;

   /**
   * 关联的卡券实例 ID (如果支付方式是 ValueCard 或 CountCard)
   * 用于追踪具体是哪张卡进行了消费。
   * - 历史预约与消费记录展示逻辑
   */
  cardInstanceId?: string | null;

  /**
   * 关联的预约单 ID (如果交易类型是 ServiceConsumption)
   *,
   */
  appointmentId?: string | null;

  /**
   * 操作此交易的团队成员 ID
   *
   */
  operatorId: string; // ITeamMember['id']

  /**
   * 交易发生时间 (ISO 8601 格式)
   */
  createdAt: string;

  // 交易单不可修改，通常没有 updatedAt
}

/**
 * 卡券类型
 * CountCard: 次卡
 * ValueCard: 储值卡
 *
 */
export type CardType = 'CountCard' | 'ValueCard';

/**
 * 有效期规则类型
 * Permanent: 永久有效
 * Relative: 购买后 N [天/月/年] 内有效
 * Fixed: 固定日期前有效
 *
 */
export type ValidityRuleType = 'Permanent' | 'Relative' | 'Fixed';

/**
 * 卡券模板状态
 *
 */
export type CardTemplateStatus = 'Active' | 'Disabled';


/**
 * 卡券模板 (CardTemplate)
 *
 * 由 `商家` 预设的可售卖的卡券产品类型。
 *,
 */
export interface ICardTemplate {
  /**
   * 模板唯一标识符
   *
   */
  id: string;

  /**
   * 所属店铺 ID
   *
   */
  shopId: string;

  /**
   * 模板名称
   *,
   */
  name: string;

  /**
   * 卡券类型 ('CountCard' 或 'ValueCard')
   *,
   */
  type: CardType;

  /**
   * 售价 (以分为单位)
   *,
   */
  price: number;

  /**
   * 有效期规则类型
   *
   */
  validityRuleType: ValidityRuleType;

  /**
   * 有效期数值 (当 validityRuleType 为 'Relative' 时)
   * 例如: 30
   *
   */
  validityValue?: number | null;

  /**
   * 有效期单位 (当 validityRuleType 为 'Relative' 时)
   * 例如: 'Day', 'Month', 'Year'
   *
   */
  validityUnit?: 'Day' | 'Month' | 'Year' | null;

  /**
   * 固定过期日期 (当 validityRuleType 为 'Fixed' 时)
   * ISO 8601 格式 (仅日期部分，如 '2026-12-31')
   *
   */
  fixedExpiryDate?: string | null;

  /**
   * 包含次数 (仅当 type 为 'CountCard' 时)
   *,
   */
  totalCount?: number | null;

  /**
   * 储值面额 (仅当 type 为 'ValueCard' 时)
   * (以分为单位)
   *,
   */
  faceValue?: number | null;

  /**
   * 赠送金额 (仅当 type 为 'ValueCard' 时, 可选)
   * (以分为单位)
   *,
   */
  bonusValue?: number | null;

  /**
   * 备注说明 (可选)
   *
   */
  remarks?: string | null;

  /**
   * 模板状态 ('Active' 或 'Disabled')
   *
   */
  status: CardTemplateStatus;

  /**
   * 模板创建时间 (ISO 8601 格式)
   */
  createdAt: string;

  /**
   * 模板最后更新时间 (ISO 8601 格式)
   */
  updatedAt: string;
}

/**
 * 卡券实例状态
 * Active: 有效 (在有效期内且有余额/次数)
 * Depleted: 已用尽 (余额/次数为 0)
 * Expired: 已过期 (超出有效期)
 * Frozen: 已冻结 (因会员归档导致)
 * - 核心业务规则
 */
export type CardInstanceStatus = 'Active' | 'Depleted' | 'Expired' | 'Frozen';


/**
 * 卡券实例 (CardInstance)
 *
 * `会员` 实际持有的具体卡券资产。
 *,
 */
export interface ICardInstance {
  /**
   * 实例唯一标识符
   *
   */
  id: string;

  /**
   * 关联的卡券模板 ID
   *
   */
  cardTemplateId: string;

  /**
   * 所属会员 ID
   *
   */
  memberId: string;

  /**
   * 卡券类型 (冗余存储，方便查询)
   */
  type: CardType;

  /**
   * 剩余次数 (仅当 type 为 'CountCard' 时)
   *,
   */
  remainingCount?: number | null;

  /**
   * 剩余余额 (仅当 type 为 'ValueCard' 时)
   * (以分为单位)
   *,
   */
  remainingValue?: number | null;

  /**
   * 过期时间 (ISO 8601 格式, 日期部分)
   * 在实例创建时根据模板规则计算得出。
   *,
   */
  expiryDate: string | null; // null 表示永久有效

  /**
   * 卡券实例状态
   *
   */
  status: CardInstanceStatus;

  /**
   * 实例创建时间 (即购买/办理时间) (ISO 8601 格式)
   */
  createdAt: string;

  /**
   * 实例最后更新时间 (例如消费、充值、状态变更) (ISO 8601 格式)
   */
  updatedAt: string;
}

/**
 * 卡券流水变动类型
 * Purchase: 购买/开卡
 * Recharge: 充值
 * Consumption: 消费/核销
 * Expire: 过期作废 (如果需要记录)
 * Freeze: 冻结
 * Unfreeze: 解冻
 *,
 */
export type LedgerEntryType =
  | 'Purchase'
  | 'Recharge'
  | 'Consumption'
  | 'Expire'
  | 'Freeze'
  | 'Unfreeze';

/**
 * 卡券流水 (LedgerEntry)
 *
 * 追踪 `卡券实例` 余额或次数变化的明细账本。
 *,
 */
export interface ILedgerEntry {
  /**
   * 流水唯一标识符
   *
   */
  id: string;

  /**
   * 所属卡券实例 ID
   *
   */
  cardInstanceId: string;

  /**
   * 变动类型
   *
   */
  type: LedgerEntryType;

  /**
   * 变动值 (以分为单位 或 次数)
   * 正数表示增加 (如充值)，负数表示减少 (如消费)
   *
   */
  changeValue: number;

  /**
   * 变动前的余额/次数
   *
   */
  balanceBefore: number;

  /**
   * 变动后的余额/次数
   *
   */
  balanceAfter: number;

  /**
   * 关联的交易单 ID (如果是 Purchase, Recharge, Consumption 类型)
   *
   */
  transactionId?: string | null;

  /**
   * 操作备注 (可选, 例如 '会员生日赠送')
   */
  remarks?: string | null;

  /**
   * 流水创建时间 (ISO 8601 格式)
   */
  createdAt: string;
}

