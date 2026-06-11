import type { InterviewSession } from './types'
const DB='interviewlab', STORE='sessions'
function openDb(): Promise<IDBDatabase>{return new Promise((resolve,reject)=>{const req=indexedDB.open(DB,1);req.onupgradeneeded=()=>req.result.createObjectStore(STORE,{keyPath:'id'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
export async function saveSession(session:InterviewSession){const db=await openDb();return new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(session);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error)})}
export async function listSessions():Promise<InterviewSession[]>{const db=await openDb();return new Promise((resolve,reject)=>{const req=db.transaction(STORE).objectStore(STORE).getAll();req.onsuccess=()=>resolve(req.result.sort((a,b)=>b.startedAt-a.startedAt));req.onerror=()=>reject(req.error)})}
export async function deleteSession(id:string){const db=await openDb();db.transaction(STORE,'readwrite').objectStore(STORE).delete(id)}
