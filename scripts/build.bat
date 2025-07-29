
@echo off
SET EMSDK=C:\Users\walls\OneDrive\Documents\GitHub\emsdk

%EMSDK%\emsdk.bat activate latest

emcc -v

emcc cpp/solver_v2.cpp cpp/solver_v3.cpp cpp/bindings.cpp \
  -O3 -s WASM=1 -s MODULARIZE=1 -s EXPORT_NAME="SolverModule" \
  -s EXPORTED_FUNCTIONS="['_solve', '_malloc', '_free']" \
  -s ALLOW_MEMORY_GROWTH=1 \
  -o src/wasm/solver.js
