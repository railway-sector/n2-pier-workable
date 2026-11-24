import{D9 as l}from"./index-Mm-x6JL1.js";import{EO as c,tL as x,K9 as y,Gp as g,fK as j,mf as v}from"./index-Mm-x6JL1.js";function u(n){let{options:e,value:r}=n;return typeof e[r]=="number"}function p(n){let e="";for(let r in n){let t=n[r];if(typeof t=="boolean")t&&(e+=`#define ${r}
`);else if(typeof t=="number")e+=`#define ${r} ${t.toFixed()}
`;else if(typeof t=="object")if(u(t)){let{value:f,options:o,namespace:a}=t,i=a?`${a}_`:"";for(let s in o)e+=`#define ${i}${s} ${o[s].toFixed()}
`;e+=`#define ${r} ${i}${f}
`}else{let f=t.options,o=0;for(let a in f)e+=`#define ${f[a]} ${(o++).toFixed()}
`;e+=`#define ${r} ${f[t.value]}
`}}return e}function d(n,e,r,t=""){return new l(n,t+e.vertexShader,t+e.fragmentShader,r)}export{c as BufferObject,l as DisposableProgram,x as FramebufferObject,y as ProgramCache,g as Renderbuffer,j as Texture,v as VertexArrayObject,d as createProgram,p as glslifyDefineMap};
