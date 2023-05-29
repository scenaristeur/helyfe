

- when `npx canvas-sketch-cli sketch.js --new --template=three --open`
- if 

```Error [ERR_PACKAGE_PATH_NOT_EXPORTED]: Package subpath './examples/js/controls/OrbitControls' is not defined by "exports" in /home/smag/dev/helyfe/node_modules/three/package.json```
-> canvas-sketch-cli does not work with latest threejs (> 147) -> downgrade threejs
-> see https://github.com/mattdesl/canvas-sketch/issues/180#issuecomment-1489889206

```
npm i canvas-sketch-cli@1.11.21 --save-dev  
npm install three@0.147.0 --save
```



