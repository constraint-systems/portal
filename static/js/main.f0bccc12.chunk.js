(this.webpackJsonpviewport=this.webpackJsonpviewport||[]).push([[0],{12:function(e){e.exports=JSON.parse('{"lastCommit":"linter errors"}')},17:function(e,t,n){},20:function(e,t,n){"use strict";n.r(t);var i,r,s,o=n(3),a=n.n(o),c=n(11),l=n.n(c),d=(n(17),n(5)),u=n(0),m=n(9),p=n(2),w=n.n(p),y=n(4),h=new Float32Array([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0,-.5,-.5,0]),f=function(e,t){return t?2*Math.tan(t.fov*Math.PI/360)*e/window.innerHeight:1},x=function(){var e=Object(y.a)(w.a.mark((function e(t,n){return w.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:(new u.p).load(n,(function(e){var n=e.image,i=f(5,z.camera),r=n.width*i,s=n.height*i;t.mesh.scale.set(r,s,1),t.material.map=e}));case 2:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),v=function(e,t,n){e.mouse.set(t,n),e.clip.set(t/window.innerWidth*2-1,-n/window.innerHeight*2+1,.5),e.clip2.set(e.clip.x,e.clip.y),null!==z.camera&&function(e,t,n,i,r){if(null!==i){t.copy(n),t.unproject(i),t.sub(i.position).normalize();var s=(r-i.position.z)/t.z;e.copy(i.position).add(t.multiplyScalar(s))}}(e.ray,e.tempClip,e.clip,z.camera,0)},g=function(e){return{srcWidth:e.src.max.x-e.src.min.x,srcHeight:e.src.max.y-e.src.min.y,dstWidth:e.dst.max.x-e.dst.min.x,dstHeight:e.dst.max.y-e.dst.min.y}},b=function(e){e.line1.geometry.attributes.position.array[0]=e.src.mesh.position.x,e.line1.geometry.attributes.position.array[1]=e.src.mesh.position.y,e.line1.geometry.attributes.position.array[3]=e.dst.mesh.position.x,e.line1.geometry.attributes.position.array[4]=e.dst.mesh.position.y,e.line1.geometry.attributes.position.needsUpdate=!0},O=function(e,t){var n=new u.c;n.setAttribute("position",new u.b(h,3));var i=new u.g({color:e,linewidth:t});return new u.f(n,i)},j=function(){var e=new u.c;e.setAttribute("position",new u.b(new Float32Array([-1,-1,0,1,1,0]),3));var t=new u.g({color:11184810,linewidth:2});return new u.f(e,t)},Y=function(e,t,n,i){var r=function(e,t){var n=Object(d.a)(t,4),i=n[0],r=n[1],s=n[2],o=n[3],a=Object(d.a)(e,4),c=a[0],l=a[1],m=a[2],p=a[3];return{line1:j(),src:{outline:O(11184810,2),mesh:new u.h,occluder:new u.h,min:new u.r(c-m/2,l-p/2,0),max:new u.r(c+m/2,l+p/2,0)},dst:{outline:O(11184810,4),mesh:new u.h,scene:new u.n,occluder:new u.h,min:new u.r(i-s/2,r-o/2,0),max:new u.r(i+s/2,r+o/2,0)}}}(e,t),s=g(r),o=s.srcWidth,a=s.srcHeight,c=s.dstWidth,l=s.dstHeight,p=f(i.position.z,z.camera),w=r.dst.min.x+c/2,y=r.dst.min.y+l/2,h=r.src.mesh,x=new u.k,v=new u.i({transparent:!0,opacity:0});h.geometry=x,h.material=v,h.userData.kind="src",h.scale.set(o,a,1),h.position.x=r.src.min.x+o/2,h.position.y=r.src.min.y+a/2,z.scene&&z.scene.add(h);var Y=new u.e(new Uint8Array(o/p*(a/p)*3),o/p,a/p,u.l),X=r.dst.mesh,D=new u.k,k=new u.i({map:Y});X.userData.kind="dst",X.geometry=D,X.material=k,X.scale.set(c,l,1),X.position.x=w,X.position.y=y,r.dst.scene.add(X),z.scene2.add(r.line1);var H=r.src.occluder,E=new u.k,B=new u.i({color:16711680});H.geometry=E,H.material=B,H.scale.set(o,a,1),H.position.x=r.src.min.x+o/2,H.position.y=r.src.min.y+a/2,H.position.z=1e-5,H.material.colorWrite=!1,z.scene2.add(H);var M=r.dst.occluder,W=new u.k,C=new u.i({color:16711680});M.geometry=W,M.material=C,M.scale.set(c,l,1),M.position.x=r.dst.min.x+c/2,M.position.y=r.dst.min.y+l/2,M.position.z=1e-5,M.material.colorWrite=!1,z.scene2.add(M);var L=r.src.outline;L.scale.set(o,a,1),L.position.x=r.src.min.x+o/2,L.position.y=r.src.min.y+a/2,r.dst.scene.add(r.src.outline);var F=r.dst.outline;F.material.lineWidth=4,F.material.needsUpdate=!0,F.scale.set(c,l,1),F.position.x=r.dst.min.x+c/2,F.position.y=r.dst.min.y+l/2,r.dst.scene.add(r.dst.outline);var S=n.length>0?Math.max.apply(Math,Object(m.a)(n.map((function(e){return e.src.mesh.renderOrder}))))+1:0,q=n.length>0?Math.min.apply(Math,Object(m.a)(n.map((function(e){return e.dst.outline.renderOrder}))))-1:999;r.src.mesh.renderOrder=S,r.dst.mesh.renderOrder=S+1,r.line1.renderOrder=q,r.src.occluder.renderOrder=q-1,r.dst.occluder.renderOrder=q-2,r.src.outline.renderOrder=q-1,r.dst.outline.renderOrder=q-2,z.portals.push(r),b(r)},X=function(e,t){var n=z.drawBox,i=n.outline,r=n.min,s=n.max,o=n.diff;i.visible=!0,r.copy(e).min(t),s.copy(e).max(t),o.subVectors(s,r),i.position.x=r.x+o.x/2,i.position.y=r.y+o.y/2,i.scale.x=o.x,i.scale.y=o.y},D=new u.k,k=new u.o,H=new u.i({map:k});s=D,r=H,i=new u.h(D,H);var z={canvas:null,camera:null,renderer:null,scene:new u.n,scene2:new u.n,scene3:new u.n,scene4:new u.n,raycaster:new u.m,zoomRay:{clip:new u.r,tempClip:new u.r,ray:new u.r},drawBox:{min:new u.r,max:new u.r,diff:new u.r,outline:O(16777215,2)},intersects:[],image:{mesh:i,material:r,geometry:s,box:new u.a,down:new u.r},cameraDown:new u.r,portals:[],pointer:{mouse:new u.q,clip:new u.r,clip2:new u.q,tempClip:new u.r,ray:new u.r,diffMouse:new u.q,diff:new u.r,active:!1,down:{mouse:new u.q,clip:new u.r,clip2:new u.q,tempClip:new u.r,ray:new u.r}}},E=n(8),B=new u.d("rgb(238, 88, 181)"),M=function(e){var t=z.portals,n=z.raycaster,i=z.camera,r=z.canvas;if(i&&r){var s=t.map((function(e){return e.dst.mesh})).concat(t.map((function(e){return e.src.mesh})));n.setFromCamera(e.clip2,i);var o=function(e){if(1===e.length)return e;if(0===e.length)return[];var t=e.map((function(e){return e.renderOrder})),n=Math.max.apply(Math,Object(m.a)(t));return[e[t.indexOf(n)]]}(z.raycaster.intersectObjects(s).map((function(e){return e.object})));z.intersects=o,o.length>0?r.style.cursor="default":r.style.cursor="crosshair";for(var a=z.intersects.map((function(e){return e.uuid})),c=0;c<t.length;c++){var l=t[c],d=l.src.mesh,u=l.dst.mesh;a.includes(d.uuid)||a.includes(u.uuid)?(l.src.outline.material.color.set(B),l.dst.outline.material.color.set(B),l.line1.material.color.set(B)):(l.src.outline.material.color.setHex(11184810),l.dst.outline.material.color.setHex(11184810),l.line1.material.color.setHex(11184810))}}},W=function(){return Object(o.useEffect)((function(){var e=z.canvas,t=z.pointer,n=z.camera,i=z.cameraDown,r=z.image,s=z.portals;if(e&&n){var o=function(s){if(v(t,s.clientX,s.clientY),function(e){e.down.mouse.copy(e.mouse),e.down.clip.copy(e.clip),e.down.ray.copy(e.ray)}(t),r.down.copy(r.mesh.position),i.copy(n.position),t.active=!0,z.intersects.length>0){var o=z.intersects[0];o.userData.origin=new u.r,o.userData.origin.copy(o.position)}else X(t.down.ray,t.ray);e.setPointerCapture(s.pointerId)},a=function(e){if(v(t,e.clientX,e.clientY),t.active){t.diffMouse.copy(t.mouse).sub(t.down.mouse);var i=f(n.position.z,n),o=t.diffMouse.x*i,a=t.diffMouse.y*i;if(z.drawBox.outline.visible)X(t.down.ray,t.ray);else if(z.intersects.length>0){var c=z.intersects[0];if("dst"===c.userData.kind){var l=s.map((function(e){return e.dst.mesh.uuid})).indexOf(c.uuid),d=s[l];c.position.setX(c.userData.origin.x+o),c.position.setY(c.userData.origin.y-a);var u=c.userData.origin.x+o,m=c.userData.origin.y-a;d.dst.min.setX(u-c.scale.x/2),d.dst.min.setY(m-c.scale.y/2),d.dst.max.setX(u+c.scale.x/2),d.dst.max.setY(m+c.scale.y/2),s[l].dst.occluder.position.setX(u),s[l].dst.occluder.position.setY(m),s[l].dst.outline.position.setX(u),s[l].dst.outline.position.setY(m),b(d)}else if("src"===c.userData.kind){var p=s.map((function(e){return e.src.mesh.uuid})).indexOf(c.uuid),w=s[p],y=c.userData.origin.x+o,h=c.userData.origin.y-a;c.position.setX(y),c.position.setY(h),w.src.min.setX(y-c.scale.x/2),w.src.min.setY(h-c.scale.y/2),w.src.max.setX(y+c.scale.x/2),w.src.max.setY(h+c.scale.y/2),s[p].src.occluder.position.setX(y),s[p].src.occluder.position.setY(h),s[p].src.outline.position.setX(y),s[p].src.outline.position.setY(h),w.src.outline.position.setX(c.userData.origin.x+o),w.src.outline.position.setY(c.userData.origin.y-a),b(w)}}else r.mesh.position.setX(r.down.x+o),r.mesh.position.setY(r.down.y-a)}else M(t)},c=function(i){if(t.active=!1,!0===z.drawBox.outline.visible){var r=z.drawBox.diff.x,s=z.drawBox.diff.y,o=[z.drawBox.min.x+r/2,z.drawBox.min.y+s/2,r,s];z.scene2&&(Y(o,o,z.portals,n),z.drawBox.outline.visible=!1)}e.releasePointerCapture(i.pointerId)},l=function(e){var i=window.innerHeight,o=i/(i+e.deltaY);if(z.intersects.length>0){var a,c=Object(E.a)(z.intersects);try{for(c.s();!(a=c.n()).done;){var l=a.value,d=l.scale.x,m=l.scale.y,p=d*o,w=m*o,y=t.ray.x-l.position.x,h=y/d,x=y/p,v=l.position.x+(x-h)*p,O=t.ray.y-l.position.y,j=O/m,Y=O/w,X=l.position.y+(Y-j)*w;if(l.position.x=v,l.position.y=X,l.scale.multiplyScalar(o),"dst"===l.userData.kind){var D=s.map((function(e){return e.dst.mesh.uuid})).indexOf(l.uuid),k=s[D];s[D].dst.occluder.position.setX(v),s[D].dst.occluder.position.setY(X),s[D].dst.outline.position.setX(v),s[D].dst.outline.position.setY(X),s[D].dst.outline.scale.copy(l.scale),s[D].dst.occluder.scale.copy(l.scale),k.dst.min.setX(v-l.scale.x/2),k.dst.min.setY(X-l.scale.y/2),k.dst.max.setX(v+l.scale.x/2),k.dst.max.setY(X+l.scale.y/2),b(k)}else"src"===l.userData.kind&&function(){var e=s.map((function(e){return e.src.mesh.uuid})).indexOf(l.uuid),t=s[e];l.position.setX(v),l.position.setY(X),s[e].src.occluder.position.setX(v),s[e].src.occluder.position.setY(X),s[e].src.outline.position.setX(v),s[e].src.outline.position.setY(X),t.src.outline.position.setX(v),t.src.outline.position.setY(X),s[e].src.outline.scale.copy(l.scale),s[e].src.occluder.scale.copy(l.scale),t.src.min.setX(v-l.scale.x/2),t.src.min.setY(X-l.scale.y/2),t.src.max.setX(v+l.scale.x/2),t.src.max.setY(X+l.scale.y/2);var i=g(t),r=i.srcWidth,o=i.srcHeight,a=f(n.position.z,z.camera),c=new u.e(new Uint8Array(r/a*(o/a)*3),r/a,o/a,u.l);t.dst.mesh.material.map=c,b(t)}()}}catch(U){c.e(U)}finally{c.f()}}else{var H=r.mesh.scale.x,B=r.mesh.scale.y,M=H*o,W=B*o,C=t.ray.x-r.mesh.position.x,L=C/H,F=C/M,S=r.mesh.position.x+(F-L)*M,q=t.ray.y-r.mesh.position.y,A=q/B,P=q/W,I=r.mesh.position.y+(P-A)*W;r.mesh.position.x=S,r.mesh.position.y=I,r.mesh.scale.multiplyScalar(o)}};return e.addEventListener("pointerdown",o),e.addEventListener("pointermove",a),e.addEventListener("pointerup",c),e.addEventListener("pointercancel",c),e.addEventListener("mousewheel",l,{passive:!1}),function(){e.removeEventListener("pointerdown",o),e.removeEventListener("pointermove",a),e.removeEventListener("pointerup",c),e.removeEventListener("pointercancel",c),e.removeEventListener("mousewheel",l)}}}),[]),null},C=n(12),L=n(1),F=function(){return Object(L.jsxs)("div",{style:{position:"fixed",right:0,bottom:0,background:"white",color:"black",fontSize:13,lineHeight:1.2},children:["Under construction",Object(L.jsx)("br",{}),Object(L.jsx)("a",{href:"https://github.com/constraint-systems/portal",target:"_blank",rel:"noreferrer",children:C.lastCommit})]})},S=function(){var e=Object(o.useRef)(null),t=Object(o.useState)(!1),n=Object(d.a)(t,2),i=n[0],r=n[1];return Object(o.useEffect)((function(){var t=e.current;if(z.canvas=t,null!==t){var n=new u.j(75,window.innerWidth/window.innerHeight,.1,1e3);z.camera=n;var i=new u.s({canvas:t});i.setSize(window.innerWidth,window.innerHeight),i.autoClear=!1,z.renderer=i,r(!0),z.scene.add(z.image.mesh),x(z.image,"bowiebig.png"),n.position.z=5,z.drawBox.outline.visible=!1,z.drawBox.outline.renderOrder=999,z.scene3.add(z.drawBox.outline);var s=new u.q;!function e(){requestAnimationFrame(e),i.clear(),i.render(z.scene,n);for(var t=f(n.position.z,z.camera),r=0;r<z.portals.length;r++){var o=z.portals[r];s.x=o.src.min.x/t+window.innerWidth/2,s.y=o.src.min.y/t+window.innerHeight/2,i.copyFramebufferToTexture(s,o.dst.mesh.material.map),i.render(o.dst.scene,n)}i.render(z.scene2,n),i.clearDepth(),i.render(z.scene3,n)}()}}),[]),Object(o.useEffect)((function(){var e=z.camera,t=z.renderer;if(e&&t){window.addEventListener("resize",(function(){e.aspect=window.innerWidth/window.innerHeight,e.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight)}))}}),[]),Object(L.jsxs)(L.Fragment,{children:[Object(L.jsx)("canvas",{ref:e}),i?Object(L.jsx)(L.Fragment,{children:Object(L.jsx)(W,{})}):null,Object(L.jsx)(F,{})]})},q=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,21)).then((function(t){var n=t.getCLS,i=t.getFID,r=t.getFCP,s=t.getLCP,o=t.getTTFB;n(e),i(e),r(e),s(e),o(e)}))};l.a.render(Object(L.jsx)(a.a.StrictMode,{children:Object(L.jsx)(S,{})}),document.getElementById("root")),q()}},[[20,1,2]]]);
//# sourceMappingURL=main.f0bccc12.chunk.js.map