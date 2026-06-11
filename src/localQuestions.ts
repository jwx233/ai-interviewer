import type { Difficulty, InterviewQuestion, Role } from './types'

const java: InterviewQuestion[] = [
  { id:'j1',type:'single_choice',topic:'Java 基础',difficulty:'初级',question:'HashMap 在 Java 8 中发生严重哈希冲突时，链表达到阈值后会转换为什么？',options:[{id:'A',text:'数组'},{id:'B',text:'红黑树'},{id:'C',text:'队列'},{id:'D',text:'跳表'}],correctAnswers:['B'],explanation:'Java 8 在满足容量条件且链表长度达到阈值后会树化为红黑树。' },
  { id:'j2',type:'multiple_choice',topic:'Spring Boot',difficulty:'中级',question:'下列哪些方式可用于 Spring Bean 依赖注入？',options:[{id:'A',text:'构造器注入'},{id:'B',text:'Setter 注入'},{id:'C',text:'字段注入'},{id:'D',text:'SQL 注入'}],correctAnswers:['A','B','C'],explanation:'构造器、Setter 和字段注入均受 Spring 支持。' },
  { id:'j3',type:'open_answer',topic:'Redis',difficulty:'中级',question:'请说明缓存穿透、缓存击穿和缓存雪崩的区别，以及常见解决方案。',referenceAnswer:'穿透是查询不存在数据；击穿是热点 Key 失效；雪崩是大量 Key 同时失效。可分别使用布隆过滤器/空值缓存、互斥锁、随机过期时间与限流降级。' },
  { id:'j4',type:'open_answer',topic:'项目经历',difficulty:'高级',question:'介绍一个你负责的关键功能，说明技术选择、遇到的问题以及如何验证最终效果。',referenceAnswer:'回答应包含背景、职责、方案取舍、难点、量化结果和复盘。' },
  { id:'j5',type:'single_choice',topic:'MySQL',difficulty:'中级',question:'MySQL InnoDB 默认事务隔离级别是什么？',options:[{id:'A',text:'READ UNCOMMITTED'},{id:'B',text:'READ COMMITTED'},{id:'C',text:'REPEATABLE READ'},{id:'D',text:'SERIALIZABLE'}],correctAnswers:['C'],explanation:'InnoDB 默认使用 REPEATABLE READ。' },
]
const common: InterviewQuestion[] = [
  { id:'c1',type:'single_choice',topic:'工程实践',difficulty:'初级',question:'发现线上故障时，最优先应该做什么？',options:[{id:'A',text:'立即重写系统'},{id:'B',text:'先止损并保留现场信息'},{id:'C',text:'删除日志'},{id:'D',text:'忽略告警'}],correctAnswers:['B'],explanation:'线上故障应优先止损，同时保存日志、指标等现场信息。' },
  { id:'c2',type:'open_answer',topic:'项目经历',difficulty:'中级',question:'请介绍一个最能体现你能力的项目，并说明你的具体贡献。',referenceAnswer:'应清晰说明场景、个人职责、行动、结果与复盘。' },
  { id:'c3',type:'multiple_choice',topic:'协作沟通',difficulty:'中级',question:'需求存在歧义时，哪些做法更合理？',options:[{id:'A',text:'确认目标和验收标准'},{id:'B',text:'记录关键决策'},{id:'C',text:'自行猜测后直接上线'},{id:'D',text:'用原型或示例对齐'}],correctAnswers:['A','B','D'],explanation:'应通过目标、记录和示例减少理解偏差。' },
]
export function getLocalQuestions(role: Role, difficulty: Difficulty) {
  const source = role === 'Java 后端' ? [...java, ...common] : [...common, ...java.slice(2,4)]
  return source.map((q) => ({ ...q, difficulty }))
}
