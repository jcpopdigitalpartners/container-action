import http from 'node:http';
import {Pool} from 'pg';
const port=Number(process.env.PORT || 3000);
const pool=new Pool({
 host:process.env.DB_HOST || 'localhost',
 port:Number(process.env.DB_PORT||5432),
 database:process.env.DB_NAME || 'course',
 user:process.env.DB_USER || 'course',
 password:process.env.DB_PASSWORD || 'coursepass',
 max:5, connectionTimeoutMillis:1800,
});
let initialized=false;
async function ensureTable(){
 if(initialized)return;
 await pool.query('CREATE TABLE IF NOT EXISTS items (id SERIAL PRIMARY KEY, name TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT now())');
 initialized=true;
}
function send(res,status,body){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(body));}
const server=http.createServer(async(req,res)=>{
 try {
  if(req.url==='/health')return send(res,200,{status:'alive'});
  if(req.url==='/ready'){
   await pool.query('SELECT 1');return send(res,200,{status:'ready'});
  }
  if(req.url==='/items' && req.method==='GET'){
   await ensureTable();const result=await pool.query('SELECT id,name,created_at FROM items ORDER BY id LIMIT 100');return send(res,200,{items:result.rows});
  }
  if(req.url==='/items' && req.method==='POST'){
   let data='';for await(const chunk of req){data+=chunk;if(data.length>20_000) return send(res,413,{error:'request too large'});}
   const name=JSON.parse(data).name;
   if(typeof name!=='string'||name.trim().length===0||name.length>120)return send(res,400,{error:'name must contain 1–120 characters'});
   await ensureTable();const result=await pool.query('INSERT INTO items (name) VALUES ($1) RETURNING id,name,created_at',[name.trim()]);return send(res,201,{item:result.rows[0]});
  }
  send(res,404,{error:'not found'});
 }catch(error){console.error('API request failure:',error.message);send(res,503,{error:'database unavailable or invalid input'});}
});
server.listen(port,'0.0.0.0',()=>console.log(`course-api listening on ${port}`));
async function shutdown(){server.close();await pool.end();process.exit(0)}
process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
