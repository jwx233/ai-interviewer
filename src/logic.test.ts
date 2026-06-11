import { describe, expect, it } from 'vitest'
import { buildLocalReport, parseJsonObject, scoreChoice, validateQuestion } from './logic'
const question = { id:'1',type:'multiple_choice' as const,question:'测试',topic:'Java',difficulty:'中级' as const,options:[{id:'A',text:'A'},{id:'B',text:'B'}],correctAnswers:['A','B'] }
describe('interview logic',()=>{it('validates questions',()=>expect(validateQuestion(question)).toBe(true));it('scores choices',()=>{expect(scoreChoice(question,['B','A'])).toBe(100);expect(scoreChoice(question,['A'])).toBe(30)});it('parses fenced json',()=>expect(parseJsonObject('```json\n{\"ok\":true}\n```')).toEqual({ok:true}));it('builds report',()=>expect(buildLocalReport([{question,answer:['A','B']}]).totalScore).toBe(100))})
