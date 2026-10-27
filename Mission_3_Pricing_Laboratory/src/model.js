export const copy=x=>JSON.parse(JSON.stringify(x));
export const usd=x=>Number.isFinite(x)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(x):'Not attainable';
export const num=x=>Number.isFinite(x)?new Intl.NumberFormat('en-US',{maximumFractionDigits:1}).format(x):'Not attainable';
export const months=f=>({monthly:1,quarterly:3,annual:12}[f]||1);
export const priceMonthly=p=>p.price/(p.billing==='annual'?12:1);
export const fingerprint=m=>JSON.stringify(m);
export function validate(m){
 if(!m||!Array.isArray(m.products)||!m.products.length||m.products.length>30||!Array.isArray(m.costs)||m.costs.length>150)throw Error('Use a configuration with 1–30 plans and at most 150 expenses.');
 if(!m.venture||typeof m.venture.name!=='string'||!m.websites||!/^https:\/\//.test(m.websites.original_live_url||''))throw Error('Venture and website metadata are missing.');
 const ids=new Set();for(const p of m.products){if(ids.has(p.id)||!p.id||!p.name||!['monthly','annual'].includes(p.billing))throw Error('Plan IDs, names or billing model are invalid.');if(!Array.isArray(p.features)||p.features.some(f=>typeof f!=='string')||typeof p.description!=='string'||typeof p.addons!=='string')throw Error('Plan descriptions or features are invalid.');ids.add(p.id);for(const k of ['price','quantity','unitCost'])if(!Number.isFinite(p[k])||p[k]<0||p[k]>1e8)throw Error('Plan values must be finite, nonnegative and at most 100 million.');}
 const costs=new Set();for(const e of m.costs){if(costs.has(e.id)||!e.id||!e.name||!['fixed','unit','percent','transaction'].includes(e.kind)||!['monthly','quarterly','annual','once'].includes(e.frequency)||!['Researched','Estimated','Illustrative','Student-Entered'].includes(e.status))throw Error('Invalid expense structure.');costs.add(e.id);if(e.target!=='all'&&!ids.has(e.target))throw Error('An expense points to an unknown plan.');if(!Number.isFinite(e.amount)||e.amount<0||e.amount>1e8||!Number.isFinite(e.amortMonths)||e.amortMonths<0||e.amortMonths>1200)throw Error('Invalid cost or amortization value.');if(e.frequency==='once'&&e.kind!=='fixed')throw Error('Startup costs must use fixed classification.');if(e.source&&!/^https:\/\//.test(e.source))throw Error('Source links must use HTTPS.');}
 for(const k of ['downside','upside'])if(!Number.isFinite(m[k])||m[k]<0||m[k]>10)throw Error('Volume factors must be between zero and ten.');
 return true;
}
export function calculate(m,options={}){
 const scale=options.volumeScale??1,costScale=options.costScale??1;
 const ps=m.products.map(p=>({...p,quantity:p.quantity*scale,monthlyPrice:priceMonthly(p),fixed:0,unitVariable:p.unitCost*costScale,percent:0,transaction:0}));
 const totalQty=ps.reduce((s,p)=>s+p.quantity,0),active=m.costs.filter(e=>e.enabled),costRows=[];
 let startup=0,sharedFixed=0;
 for(const e of active){const targets=ps.filter(p=>e.target==='all'||e.target===p.id);let monthly=0;
  if(e.frequency==='once'){startup+=e.amount;if(e.amortMonths>0){monthly=e.amount/e.amortMonths*costScale;if(e.target==='all')sharedFixed+=monthly;else targets.forEach(p=>p.fixed+=monthly);}}
  else if(e.kind==='fixed'){monthly=e.amount/months(e.frequency)*costScale;if(e.target==='all')sharedFixed+=monthly;else targets.forEach(p=>p.fixed+=monthly);}
  else for(const p of targets){
   if(e.kind==='percent'){p.percent+=e.amount/100*costScale;monthly+=p.monthlyPrice*p.quantity*e.amount/100*costScale;}
   else {const v=e.amount/(e.kind==='transaction'?1:months(e.frequency))/(e.kind==='transaction'&&p.billing==='annual'?12:1)*costScale;p.unitVariable+=v;monthly+=v*p.quantity;}
  }
  costRows.push({...e,monthly,annualized:monthly*12});
 }
 for(const p of ps){p.allocation=totalQty?p.quantity/totalQty:1/ps.length;p.fixed+=sharedFixed*p.allocation;p.unitVariable+=p.monthlyPrice*p.percent;p.revenue=p.monthlyPrice*p.quantity;p.variable=p.unitVariable*p.quantity;p.contribution=p.monthlyPrice-p.unitVariable;p.margin=p.monthlyPrice?p.contribution/p.monthlyPrice:null;p.profit=p.revenue-p.variable-p.fixed;p.breakEven=p.contribution>0?p.fixed/p.contribution:null;}
 const fixed=ps.reduce((s,p)=>s+p.fixed,0),revenue=ps.reduce((s,p)=>s+p.revenue,0),variable=ps.reduce((s,p)=>s+p.variable,0),contribution=revenue-variable;
 const weightedCM=totalQty?contribution/totalQty:null,weightedPrice=totalQty?revenue/totalQty:null;
 const breakEven=weightedCM>0?fixed/weightedCM:null;
 const profit=contribution-fixed,beRevenue=breakEven===null?null:breakEven*weightedPrice;
 return {products:ps,costRows,fixed,variable,revenue,contribution,profit,totalQty,unitVariable:totalQty?variable/totalQty:null,weightedCM,weightedPrice,breakEven,breakEvenWhole:breakEven===null?null:Math.ceil(breakEven-1e-9),beRevenue,margin:revenue?contribution/revenue:null,safety:revenue&&beRevenue!==null?(revenue-beRevenue)/revenue:null,startup,annualProfit:profit*12};
}
export function competitors(research,p,partial=false){return research.pricing_offers.filter(o=>(p.billing==='annual'?o.annual_counterpart:o.representative)&&o.current_price>0&&(o.verification_status==='Verified'||partial&&o.verification_status==='Partially Verified')).map(o=>({...o,classification:research.competitors.find(c=>c.competitor_id===o.competitor_id).classification,delta:p.price-o.current_price})).sort((a,b)=>a.current_price-b.current_price);}
export const median=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n?n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2:null;};
export function evaluate(m,research){
 const f=calculate(m),down=calculate(m,{volumeScale:.8}),stress=calculate(m,{costScale:1.1});const financial=[],competitive=[],evidence=[],strengths=[],recommendations=[];
 const nonpositive=f.products.filter(p=>p.contribution<=0);if(nonpositive.length)financial.push(`${nonpositive.map(p=>p.name).join(', ')} has zero or negative contribution per customer-month. Increasing its sales cannot cover fixed costs under constant assumptions.`);
 if(f.profit<0)financial.push(`The selected monthly volume produces a loss of ${usd(-f.profit)} against fixed costs of ${usd(f.fixed)}.`);else strengths.push(`The selected volume covers modeled operating costs with ${usd(f.profit)} monthly profit before taxes and finance.`);
 if(f.totalQty===0)financial.push('No active customers are assumed; the current sales mix and break-even are undefined.');
 if(down.profit<0)financial.push(`At 20% lower volume, monthly operating profit is ${usd(down.profit)}.`);
 if(stress.profit<0)financial.push(`With all operating cost rates and fixed costs 10% higher, monthly profit is ${usd(stress.profit)}.`);
 if(f.safety!==null&&f.safety<.2)financial.push(`Margin of safety is ${(f.safety*100).toFixed(1)}%; less than the review rule of 20%.`);
 const active=m.costs.filter(e=>e.enabled),unknown=active.filter(e=>['Estimated','Illustrative'].includes(e.status)||!e.source),missing=['Technology','Product & safety','Support','Compliance','Marketing','Distribution'].filter(c=>!active.some(e=>e.category===c));
 evidence.push(`${unknown.length} of ${active.length} active expenses are estimates, illustrations or have no source. Student changes are selections, not supplier quotes.`);
 if(missing.length)evidence.push(`No active expense in: ${missing.join(', ')}. Confirm whether these costs are omitted or provided without charge.`);
 evidence.push('All customer counts are unsupported planning assumptions. Free users, churn, acquisition cohorts, taxes, financing, stepwise capacity and working capital are not modeled.');
 evidence.push(`Competitor listings were checked ${research.research_date}; they can change. Threshold Fit features and differentiation remain untested.`);
 if(active.some(e=>e.id==='store-fee')&&active.some(e=>e.id==='web-fee'))evidence.push('Both app-store and web card fees apply to all allocated revenue. Disable one or allocate them to distinct plans to avoid double-counting payment channels.');
 for(const p of m.products){const os=competitors(research,p),med=median(os.map(o=>o.current_price)),r=research.preliminary_pricing_recommendation,lo=p.billing==='annual'?r.annual_min:r.monthly_min,hi=p.billing==='annual'?r.annual_max:r.monthly_max;
  competitive.push(`${p.name}: ${usd(p.price)}/${p.billing==='annual'?'year':'month'} is ${usd(p.price-med)} relative to the verified representative median ${usd(med)}; ${os.filter(o=>o.delta>0).length} alternatives are cheaper. ${p.price<lo||p.price>hi?'Outside':'Within'} the preliminary ${usd(lo)}–${usd(hi)} range.`);
  if(p.price>hi)recommendations.push(`For ${p.name}, test whether reliable integrated planning justifies the premium above ${usd(hi)}; competitors alone do not establish willingness to pay.`);
 }
 recommendations.push(`Replace the largest unsourced costs with quotes and measure AI usage and support time. Verify the distribution fee and platform eligibility before launch.`,f.profit<0?'Reduce overhead, raise contribution, or validate a credible volume that covers break-even; do not treat assumed customers as an acquisition forecast.':'Validate retention and acquisition economics before using this modeled profit to commit resources.');
 const severe=nonpositive.length>0||f.profit<0;
 const classification=severe?'Financially unsustainable under current assumptions':financial.length||missing.length?'High modeled risk':unknown.length?'Moderate modeled risk':'Lower modeled risk';
 return {classification,financial,competitive,evidence,strengths,recommendations,majorWarnings:severe||financial.length>0||missing.length>0,results:f,downside:down,stress,criteria:'Unsustainable: any plan has nonpositive contribution or total profit is negative. High: otherwise a loss under −20% volume or +10% cost stress, safety below 20%, zero volume, or missing cost category. Moderate: remaining estimates or missing sources. Lower: none of these flags. All sales and feature assumptions still require validation. These rules do not predict failure probability.'};
}
export function confirmedSnapshot(m,research,review,statement,ack,time=new Date().toISOString()){
 if(!review||review.stale||review.fingerprint!==fingerprint(m))throw Error('Evaluate the current inputs before confirming.');
 if(statement.trim().length<20)throw Error('Explain your decision in at least 20 characters.');
 if(review.findings.majorWarnings&&!ack)throw Error('Acknowledge the major warnings before confirming.');
 return copy({schema_version:1,snapshot_id:'TF-'+time,venture:m.venture,websites:m.websites,customer_facing:{venture_name:m.venture.name,products:m.products.map(p=>({id:p.id,name:p.name,description:p.description,price:p.price,currency:'USD',billing:p.billing,features:p.features,optional_addons:p.addons}))},private_financial:{model:m,results:review.findings.results,review:review.findings,competitor_research:research,scenarios:m.volumeScenarios||[]},decision_statement:statement.trim(),confirmation:{confirmed:true,evaluation_current:true,warnings_acknowledged:ack,date:time},notice:'The private_financial block is for internal review only. Use only customer_facing for a public pricing page.'});
}
