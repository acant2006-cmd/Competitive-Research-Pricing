// Lightweight event/render harness. This does not emulate browser layout or claim browser QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const nodes=new Map(),events={},winEvents={},errors=[];
function node(key){if(!nodes.has(key))nodes.set(key,{innerHTML:'',textContent:'',value:'',hidden:false,style:{setProperty(){}},dataset:{},addEventListener(type,fn){events[key+':'+type]=fn},showModal(){this.open=true},close(){this.open=false},scrollIntoView(){}});return nodes.get(key);}
globalThis.document={querySelector:node,querySelectorAll:()=>[],addEventListener:(type,fn)=>events[type]=fn};
globalThis.window={addEventListener:(type,fn)=>winEvents[type]=fn,scrollTo(){}};
globalThis.location={hash:''};
globalThis.fetch=async()=>({ok:true,json:async()=>JSON.parse(readFileSync(new URL('../data/competitor_data.json',import.meta.url)))});
const originalError=console.error;console.error=e=>errors.push(e);
await import('../src/app.js');console.error=originalError;
const change=(id,value,extra={})=>events.change({target:{id,value,dataset:{},...extra}});
const input=(id,value)=>events.input({target:{id,value}});
const click=dataset=>events.click({target:{closest:()=>({dataset})}});
test('all six views render actual research without runtime errors',()=>{assert.deepEqual(errors,[]);for(const view of ['overview','landscape','pricing','explorer','opportunities','sources']){assert.ok(node('#'+view).innerHTML.length>500,view);assert.ok(!node('#'+view).innerHTML.includes('undefined'),view+' undefined');}assert.equal(node('#application').hidden,false);});
test('slider and presets update dependent outputs',()=>{input('price-slider','40');assert.match(node('#position-output').innerHTML,/Above the researched range/);assert.match(node('#ladder').innerHTML,/\$40.00/);click({preset:'middle'});assert.equal(node('#price-input').value,'15.99');assert.match(node('#position-output').innerHTML,/Near the market middle/);assert.match(node('#delta-table').innerHTML,/Same price/);});
test('scope controls update render and annual resets selection',()=>{change('partial','',{checked:true});assert.match(node('#scope-label').textContent,/4 comparable/);change('basis','annual');assert.match(node('#explorer').innerHTML,/99.99/);change('type-filter','Direct');assert.match(node('#scope-label').textContent,/2 of 4 competitors/);input('search','no-match-xyz');assert.match(node('#overview').innerHTML,/No matching observations/);events['#reset:click']();assert.match(node('#scope-label').textContent,/4 of 4/);});
test('selection, offer filtering, details, and chart bins respond',()=>{change('','',{dataset:{select:'C01'},checked:true});change('','',{dataset:{select:'C02'},checked:true});assert.match(node('#landscape').innerHTML,/Attribute/);change('offer-status','Unavailable');assert.match(node('#pricing').innerHTML,/1 of 19 records/);click({action:'clear-offers'});click({bin:'0'});assert.match(node('#pricing').innerHTML,/Price-band selection/);click({offer:'P01'});assert.equal(node('#detail-dialog').open,true);assert.match(node('#dialog-content').innerHTML,/Centr/);});
