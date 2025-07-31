# Image Reconstruction System - Technical Requirements

## 1. Objectives & Scope
* Input: 2D image(s)
* Output: vanishing points, calibrated camera intrinsic/extrinsic properties such as camera orientation (rotation matrix), camera position (up to scale), field of view (FOV), and aspect ratio
* Goals: accurate camera reconstruction and basic scene geometry estimation with both manual and automatic input

### 2. Core Modules & Features
#### **2.1 Camera Calibration & Pose Estimation**
* Vanishing‑point detection
	* Support 2 or 3 vanishing points; infer focal length, principal point, zero skew assumption
	* Option: Detect lines, cluster into orthogonal vanishing points using RANSAC
* Calibration solver: compute intrinsic matrix K and rotation R, translation t (pinhole model)
* Option: support symmetric‑object calibration from known shape constraints
#### **2.2 Geometry Reconstruction**
* Coarse geometry: place cuboids or planar surfaces aligned to vanishing axes
* Optional full reconstruction via sparse SfM + bundle adjustment if multiple views available
* Surface normals and planar segmentation output
* Specify known size for correct scaling
#### **2.3 Semantic & Structural Cues**
* Semantic segmentation for scene context
* Use segmentation to guide depth and geometry inference (e.g., floor vs wall)
#### **2.4 Monocular Depth Estimation (Optional)**
* Integrate deep‑learning pipeline for dense depth prediction:
	* Use multi‑scale networks combining global and local refinement
	* Attention‑guided dense feature extractor for sharp structural depth detail
	* Loss terms: depth, gradient, surface‑normal accuracy for sharper boundaries

## 3. Functional Requirements
* **User Interface**:
	* Visual line annotation for vanishing point seeding
	* Reference image
	* Real‑time and adjustable preview with fitted cube/plane
	* Toolbar containing settings and annotation tools
	* Property bar containing various scene information
	* Context menu for additional options
* **Data formats**:
	* Export camera parameters as JSON (K, R, t, vanishing points, FOV)
	* Option: Blender, OpenCV, Unreal/Unity via plugin API
* **Performance**:
	* Viewport performance of 30+ FPS

## 4. Non‑Functional Requirements
* **Accuracy**:
	* Vanishing‑point localization error within few pixels
* **Reliability**:
  * Allow manual input and refinement for low quality images or missing information.
* **Extensibility** (Addons):
  * Features should be modular and extendable.
  * Allow for cross-addon interaction
    * Dispatch and listen to events
    * Abstract addon class should allow exports which can be accessed across addons
* **Cross‑platform**:
	* Web application written in HTML, CSS, TypeScript, Three.js, and WASM (C++ compiled with Emscripten).

## 5. Development Phases
1. **Interface & UX**
	* Create interface for image upload
	* Create interface for 3D viewport
	* Option: support model importing
2. **Core Development
	- Create base abstract addon (support registration, deletion, enabling, disabling, and exports)
	- Create registration system for managing addons
	- Add event system for cross addon interaction
3. **Export Addon**
	- Create addon for exporting settings as JSON
	- Option: support other output formats
4. **Annotation Addon**
	- Create tool for annotating lines (and other objects)
	- Option: implement RANSAC‑based line detection & clustering
5. **Calibration Addon**
	- Create calibration solver for camera intrinsics/extrinsics
6. **Geometry Addon**
	* Cuboid/plane fitting to depth and vanishing point axes

## 6. Desired Advanced Features
* **Lens distortion modeling**: include radial distortion estimation
* **Automatic vanishing‑point detection** via unsupervised RANSAC/clustering
* **Single‑image depth + normal + semantic multi‑task network**
* **Post‑processing refinement**: apply bundle adjustment if multiple images
* **NeRF fallback**: if multiple views available, build neural radiance field for full 3D geometry reconstruction

## 7. Project Structure
```
vanpoint/
├── public/
│   ├── favicon.svg
│   └── assets/
│       ├── icon.svg
│       └── page.svg
│
├── scripts/
│   └── build.bat          # Compile C++ files into WASM
│
├── src/
│   ├── addons/            # Additional features
│   │   ├── calibration/   # Vanishing point, K, R, t computation
│   │   ├── depth/         # Optional monocular depth estimation
│   │   ├── distortion/    # Distortion computations 
│   │   ├── export/        # Export settings in various formats 
│   │   ├── geometry/      # Cube/plane fitting 
│   │   └── Addon.ts       # Abstract addon class
│   │
│   ├── core/              # Responsible for core addon operations
│   │   ├── manager.ts     # Manages addon registration
│   │   ├── events.ts      # Event-based communication between addons
│   │   └── context.ts     # Global context between addons
│   │
│   ├── styles/
│   │   ├── components/    # Per-component style files
│   │   └── global.css     # Global styles
│   │
│   ├── types/             # Shared types/interfaces
│   │
│   ├── ui/                # UI logic & layout
│   │   ├── components/    # Reusable TS elements
│   │   └── main.ts        # App entry point (binds UI to logic)
│   │
│   ├── wasm/              # WASM interface bindings and glue
│   │   ├── dist/          # Emscripten output
│   │   ├── src/           # C++ source code
│   │   ├── index.ts       # Loader and async WASM interface
│   │   └── types.d.ts     # WASM types/interfaces
│   │
│   ├── workers/           # Web workers for offloading computations
│   │
│   ├── main.ts            # Entry point
│   └── vite-env.d.ts
│
├── .gitignore
├── tsconfig.json
├── vite.config.ts
├── package.json
└── README.md
```

## References
* Guillou et al.: vanishing points for calibration and coarse 3D reconstruction ([ResearchGate][12], [SpringerLink][3])
* Eigen et al.: depth map prediction using coarse‑to‑fine CNNs ([arXiv][6], [NeurIPS Papers][7])
* Hu et al.: multi‑scale fusion + gradient & normal loss for sharper depth ([arXiv][9])
* Hao et al.: attention‑guided network for detail preserving depth at real‑time speeds ([arXiv][8])
* Surveys: monocular depth estimation methods overview ([arXiv][10], [arXiv][11])
* Automatic VP detection & calibration frameworks ([CVF Open Access][1], [SpringerLink][2])
* Bundle adjustment theory for multi-view refinement ([Wikipedia][13])
* NeRF method for neural scene reconstruction ([Wikipedia][15])

[1]: https://openaccess.thecvf.com/content_cvpr_2017/papers/Antunes_Unsupervised_Vanishing_Point_CVPR_2017_paper.pdf?utm_source=chatgpt.com "Unsupervised Vanishing Point Detection and Camera Calibration From a ..."
[2]: https://link.springer.com/content/pdf/10.1007/978-3-642-17274-8_15.pdf?utm_source=chatgpt.com "Simultaneous Vanishing Point Detection and Camera Calibration from ..."
[3]: https://link.springer.com/article/10.1007/PL00013394?utm_source=chatgpt.com "Using vanishing points for camera calibration and coarse 3D ..."
[4]: https://staff.ustc.edu.cn/~zhuang/papers/chen08.pdf?utm_source=chatgpt.com "Full Camera Calibration from a Single View Planar Scene"
[5]: https://vgl.ict.usc.edu/Research/SingleView/Camera_Calibration_using_a_Single_View_of_a_Symmetric_Object.pdf?utm_source=chatgpt.com "Camera Calibration using a Single View of a Symmetric Object"
[6]: https://arxiv.org/abs/1406.2283?utm_source=chatgpt.com "Depth Map Prediction from a Single Image using a Multi-Scale Deep Network"
[7]: https://papers.nips.cc/paper_files/paper/2014/file/91c56ce4a249fae5419b90cba831e303-Paper.pdf?utm_source=chatgpt.com "Depth Map Prediction from a Single Image using a Multi-Scale Deep Network"
[8]: https://arxiv.org/abs/1809.00646?utm_source=chatgpt.com "Detail Preserving Depth Estimation from a Single Image Using Attention Guided Networks"
[9]: https://arxiv.org/abs/1803.08673?utm_source=chatgpt.com "Revisiting Single Image Depth Estimation: Toward Higher Resolution Maps with Accurate Object Boundaries"
[10]: https://arxiv.org/pdf/2003.06620?utm_source=chatgpt.com "Monocular Depth Estimation Based On Deep Learning: An Overview"
[11]: https://arxiv.org/abs/2104.06456?utm_source=chatgpt.com "Single Image Depth Estimation: An Overview"
[12]: https://www.researchgate.net/profile/Kadi-Bouatouch/publication/226987370_Using_Vanishing_Points_for_Camera_Calibration_and_Coarse_3D_Reconstruction_from_A_Single_Image/links/53d649900cf228d363ea4bab/Using-Vanishing-Points-for-Camera-Calibration-and-Coarse-3D-Reconstruction-from-A-Single-Image.pdf?utm_source=chatgpt.com "Using vanishing points for camera calibration and coarse 3D ..."
[13]: https://en.wikipedia.org/wiki/Bundle_adjustment?utm_source=chatgpt.com "Bundle adjustment"
[14]: https://openaccess.thecvf.com/content_ECCVW_2018/papers/11131/Koch_Evaluation_of_CNN-based_Single-Image_Depth_Estimation_Methods_ECCVW_2018_paper.pdf?utm_source=chatgpt.com "Evaluation of CNN-based Single-Image Depth Estimation Methods"
[15]: https://en.wikipedia.org/wiki/Neural_radiance_field?utm_source=chatgpt.com "Neural radiance field"
[16]: https://openaccess.thecvf.com/content_ICCV_2019/papers/van_Dijk_How_Do_Neural_Networks_See_Depth_in_Single_Images_ICCV_2019_paper.pdf?utm_source=chatgpt.com "How Do Neural Networks See Depth in Single Images?"