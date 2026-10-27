export const roundCents = n => Math.round((n + Number.EPSILON) * 100) / 100;
export const money = n => Number.isFinite(n) ? new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(n) : 'Not available';
export function quantile(values, q) {
  if (!values.length) return null;
  const a = [...values].sort((x,y)=>x-y), p = (a.length-1)*q, lo=Math.floor(p), hi=Math.ceil(p);
  return a[lo] + (a[hi]-a[lo])*(p-lo);
}
export function stats(values) {
  const a=values.filter(Number.isFinite);
  return {count:a.length,min:a.length?Math.min(...a):null,max:a.length?Math.max(...a):null,mean:a.length?a.reduce((s,x)=>s+x,0)/a.length:null,median:quantile(a,.5),q1:quantile(a,.25),q3:quantile(a,.75)};
}
export function positioning(c) {
  if(c.positioning.startsWith('Premium'))return 'Premium';
  if(c.positioning.startsWith('Mid-market'))return 'Mid-market';
  if(c.positioning.startsWith('Freemium'))return 'Freemium';
  return 'Lower-priced';
}
export function filteredCompetitors(data, state) {
  const q=(state.query||'').trim().toLowerCase();
  return data.competitors.filter(c=>(!state.type||c.classification===state.type)&&(!state.position||positioning(c)===state.position)&&(!state.onlySelected||state.selected.has(c.competitor_id))&&(!q||[c.name,c.main_products,...data.pricing_offers.filter(o=>o.competitor_id===c.competitor_id).map(o=>o.product_name)].join(' ').toLowerCase().includes(q)));
}
export function representativeOffers(data, {basis='monthly',partial=false,ids=null}={}) {
  return data.pricing_offers.filter(o=>(basis==='annual'?o.annual_counterpart:o.representative)&&o.currency==='USD'&&Number.isFinite(o.current_price)&&o.current_price>0&&(o.verification_status==='Verified'||(partial&&o.verification_status==='Partially Verified'))&&(!ids||ids.includes(o.competitor_id)));
}
export function normalizedOffers(data,{partial=false,ids=null}={}) {
  return data.pricing_offers.filter(o=>['standard','alternate_sku'].includes(o.offer_category)&&o.current_price>0&&o.currency==='USD'&&o.billing_period_months>0&&(o.verification_status==='Verified'||(partial&&o.verification_status==='Partially Verified'))&&(!ids||ids.includes(o.competitor_id))).map(o=>({...o,effective:o.current_price/o.billing_period_months}));
}
export function classify(price, values) {
  const s=stats(values);
  if(!s.count)return {label:'No comparison available',key:'empty',...s};
  if(price<s.min-.005)return {label:'Below the researched range',key:'below',...s};
  if(price>s.max+.005)return {label:'Above the researched range',key:'above',...s};
  if(s.min===s.max)return {label:'At the observed price',key:'middle',...s};
  if(price<=s.q1)return {label:'Budget-oriented',key:'lower',...s};
  if(price>=s.q3)return {label:'Premium-oriented',key:'upper',...s};
  return {label:'Near the market middle',key:'middle',...s};
}
export function relations(price,offers) {
  return offers.map(o=>({...o,delta:roundCents(price-o.current_price),relation:roundCents(price)>roundCents(o.current_price)?'Competitor is cheaper':roundCents(price)<roundCents(o.current_price)?'Competitor is more expensive':'Same price'}));
}
export function histogram(offers,count=4) {
  if(!offers.length)return [];
  const s=stats(offers.map(o=>o.effective)),width=(s.max-s.min)/count||1;
  return Array.from({length:count},(_,i)=>{
    const low=s.min+i*width,high=i===count-1?Math.max(s.max,low+width):low+width;
    return {low,high,items:offers.filter(o=>o.effective>=low&&(i===count-1?o.effective<=high:o.effective<high))};
  });
}
export function sortOffers(offers,sort='price-asc',effective=false) {
  return [...offers].sort((a,b)=>{
    if(sort==='name')return a.product_name.localeCompare(b.product_name);
    const x=effective?a.effective:a.current_price,y=effective?b.effective:b.current_price;
    if(x==null)return y==null?0:1;if(y==null)return -1;
    return sort==='price-desc'?y-x:x-y;
  });
}
export function availability(o) {
  if(o.competitor_id==='C01')return 'Unclear stock widget; checkout not tested';
  if(o.offer_category==='lifetime')return 'Limited promotion; availability unconfirmed';
  return 'Availability not independently verified';
}
export function validateData(data) {
  if(!Array.isArray(data.competitors)||!Array.isArray(data.pricing_offers)||!data.venture)throw Error('Research schema is incomplete.');
  const ids=new Set(data.competitors.map(c=>c.competitor_id)),offers=new Set();
  if(ids.size!==data.competitors.length)throw Error('Duplicate competitor IDs.');
  for(const o of data.pricing_offers){
    if(!ids.has(o.competitor_id)||offers.has(o.offer_id))throw Error('Invalid offer relationship.');
    offers.add(o.offer_id);
    for(const key of ['current_price','regular_price','promotional_price'])if(o[key]!==null&&(!Number.isFinite(o[key])||o[key]<0))throw Error('Price must be a nonnegative number or null.');
    if(!['Verified','Partially Verified','Estimated','Unavailable'].includes(o.verification_status))throw Error('Unknown verification status.');
    if(!/^https:\/\//.test(o.source_url))throw Error('Invalid source URL.');
  }
  for(const id of ids)if(data.pricing_offers.filter(o=>o.competitor_id===id&&o.representative).length!==1)throw Error('Exactly one representative per competitor is required.');
  return true;
}
