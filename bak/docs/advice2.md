你说得对——在 three.js 的 WebGLRenderer 下，不能用 Layers 做“选择性照明”。同一帧里相机把两个层一起渲染，灯光依然会影响场景里所有可见物体；Layers 只管可见性/射线，不管灯光筛选。官方论坛与文档多次确认了这一点。
three.js forum
+1
Stack Overflow

所以，要实现“地月单独渲染、互不受光照影响”，更可行的路线有两条：

方案 2：双通道/多次渲染（推荐，工程量小）

一帧两次 render（不清除颜色/深度）：

月球通道：只开“月球专属的太阳光”，只渲染月球 → 写入颜色+深度。

地球通道：关掉月球灯光，只渲染地球（保持第一步的深度不清除），这样月球像“已烘焙的前景层”，不受地球光照；地球在月球前方的部分会自然覆盖，在后方的部分会被深度遮挡。
要点：

关闭自动清屏，只在帧头清一次；按通道切可见物体与灯光即可（无须分场景也可，用同一 Scene 切 visible）。

需要“月球只投影、不着色”（例如想要月球在地球通道里产生遮光/食相效果）时，用“不可见遮挡”思路：让月球在第二通道中只参与深度/阴影而不写颜色（依赖材质的“只写深度/不写颜色”的能力）。
threejs.org
Stack Overflow

有 IBL/环境贴图 时，避免用全局 scene.environment；改为分别在地球材质和月球材质上绑定各自的 envMap，否则会破功（环境光是全局漫射源）。
three.js forum

如需后期（Bloom、色调映射），把两个通道合成后再做；或用两组 RenderPass，第二个 pass 设定不清除颜色/深度。

备注：如果你转到 WebGPU Renderer，three.js 已内置“Selective Lights”示例，能原生按对象筛灯光；但这是 WebGPU 路线，不适用于 WebGLRenderer。
threejs.org
three.js forum

方案 3：材质级 shader 改造（一次渲染，成本更高）

在月球材质上 屏蔽场景灯光循环，改为用你自己的 sunDir/intensity 做定制光照（onBeforeCompile 覆盖 lights 的 shader chunk，或直接 ShaderMaterial）。
优点：单次 render、完全隔离、可做月表相位函数等高级定制。
代价：维护三方 shader chunk 的升级差异、实现细节较多。

方案 3
可行做法（两种）

在 MeshStandard/PhysicalMaterial 上用 onBeforeCompile 覆盖光照段

思路：保留标准材质的大部分功能（法线、金属度/粗糙度、贴图解算等），只替换灯光累加的 shader chunk（例如 lights_fragment_* 段），把场景里所有灯光计算“剪掉”，改成你自己的 sunDir/intensity（月球专用）。

这是 three.js 官方推荐的扩展方式之一，用于“保留现有材质特性 + 局部改写 GLSL”。社区多次示例过这种做法。
three.js forum
Stack Overflow

完全自定义 ShaderMaterial（lights: false/true 都可）

如果你不想继承标准材质，也可以自己写顶/片元着色器：不启用场景灯光（不使用内置的 light uniforms），直接按你的月球相位模型计算。

社区也常见“在自定义 shader 里模仿/替换标准材质灯光”的讨论与示例。
three.js forum
Stack Overflow

补充：你之前担心的“每对象选择性灯光”在 WebGLRenderer 里确实不支持；那是另一条路（多通道渲染或 WebGPU 的 Selective Lights）。但本题不是按对象筛灯光，而是在材质层面不去用场景灯光，这在 WebGL 下完全可行。
three.js forum

落地要点（避免踩坑）

固定 three.js 版本：onBeforeCompile 依赖内置 chunk 名称，版本升级可能改名/改结构；锁定版本更稳。
Stack Overflow

环境光/IBL 隔离：不要用全局 scene.environment；若保留 PBR 外观，给地球/月球各自绑定 envMap（或在月球侧直接移除 envmap_fragment 段）。这一点是“隔离”的关键。

阴影策略：若月球不应受地球阴影/也不投影，就关掉 castShadow/receiveShadow；如只想“几何遮挡不着色”，需在双通道方案里做“只写深度”。

调参与相位函数：材质自定义后，你可以把“太阳方向”“地月相位”“gamma/曝光”等做成 uniforms，实时调节而不受场景灯光变化影响。

结论：

是的，“在月球材质上屏蔽场景灯光循环，改为用你自己的（光照）”是真能实现的。最务实的是 onBeforeCompile 局部替换灯光 chunk：保留 PBR 外观与贴图生态，只把光照改成你的月球专用模型；如果要彻底自定义，再用 ShaderMaterial。
three.js forum
+1
Stack Overflow

好的！这是不写具体代码的实现清单（按“做什么 / 为什么 / 成功标志”给到）。目标：让月球材质在 three.js 中完全忽略场景灯光，只吃你自定义的“太阳方向/强度/相位”等参数，同时尽量保留标准 PBR 的大部分外观能力（贴图、法线、金属度/粗糙度等）。

一、准备与版本固化

锁定 three.js 版本

做什么：固定一个已测试的 three.js 版本（如 r1xx），本项目全程使用同一版。

为什么：onBeforeCompile 依赖内部 chunk 名称；升级可能变更。

成功标志：后续所有 chunk 名称与该版本示例一致。

选择基材质

做什么：以 MeshStandardMaterial（或 MeshPhysicalMaterial，若需要透射/薄膜等）为基。

为什么：可复用 PBR 大部分能力，只替换灯光段。

成功标志：贴图（color/metalness/roughness/normal/ao/emissive）均正常生效。

二、月球材质的“隔离开关”（总体策略）

禁用全局 IBL

做什么：不要给场景设置 scene.environment，而是让月球材质不使用 envMap；若地球需要 IBL，给地球材质单独 envMap。

为什么：scene.environment 是全局的，会破坏“隔离”。

成功标志：切换/调节 scene.environment 对月球亮度毫无影响。

关闭场景灯光影响

做什么：在 onBeforeCompile 中替换/清空 lights 累加段（见后面的 chunk 指南），并注入你自己的太阳光 uniforms。

为什么：从根上避免月球参与 scene light 循环。

成功标志：关闭场景所有灯光后，月球仍按你的自定义光照发亮。

阴影策略

做什么：根据需要设置：

若不希望任何阴影：castShadow=false、receiveShadow=false。

若需要“只遮挡不着色”的效果，转用双通道渲染在第二通道里“只写深度”（不在本清单展开）。

为什么：阴影在 WebGLRenderer 下本质也走灯光/深度管线。

成功标志：地球开关阴影，对月球外观不产生意外影响。

三、需要覆盖/保留的 Shader Chunk（思路级）

注：不同版本 chunk 名可能略异，下列是常用命名思路。你无需逐字记，只要遵守原则：保留材质输入 → 替换灯光输出。

保留（不要动）的部分

common, uv*, map_pars_fragment, normal_pars_fragment, roughnessmap_pars_fragment, metalnessmap_pars_fragment, emissivemap_pars_fragment, lights_pars_begin（可保留声明但不使用）、bsdfs, normal_fragment_begin, roughnessmap_fragment, metalnessmap_fragment, emissivemap_fragment, alphamap_pars_fragment, fog_pars_fragment, tonemapping_pars_fragment, colorspace_pars_fragment 等。

为什么：这些负责取贴图、构建法线、金属/粗糙、发光、雾、色彩空间与色调映射，尽量沿用以降低维护成本。

成功标志：更换贴图与参数仍能改变月球表面细节与质感。

必须替换/屏蔽的灯光累加

典型段落：lights_fragment_begin（或 lights_fragment_maps、lights_fragment_end，依版本而异）。

做什么：将该段的 scene light 累加逻辑改为你的“太阳方向/强度/相位”计算，并把结果写回到 reflectedLight.directDiffuse 或最终 outgoingLight。

为什么：这是切断“场景灯光”的关键步骤。

成功标志：无论场景中有多少点光/平行光/聚光灯，月球只受你自定义太阳参数影响。

可选：去掉 envMap 相关段

如果要彻底隔离 IBL：在 onBeforeCompile 里屏蔽/清空 envmap_pars_fragment 与 envmap_fragment 引用，或确保材质不含 envMap。

成功标志：任何全局/外部 envMap 对月球不生效。

四、自定义光照需要的 Uniform & Defines

最低限度 uniforms

uSunDirection（世界空间或视图空间的单位向量；与你的相机/模型空间一致即可，但要全链一致）。

uSunIntensity（标量或 vec3）。

uPhaseParams（可选：用于月相/半兰伯特/高光截止等参数）。

成功标志：运行时更新这些值，月球亮度与明暗边界能实时变化。

相位 / BRDF 选择

做什么：定义一个你要的漫反射模型：

简化：max(dot(N, L), 0.0) 的兰伯特。

更真实月相：加相位函数（如近似哈尼相函数，或自定义 back-scattering/阴影变暗）。

若需要高光：用 GGX/Blinn-Phong 简化一版，或直接忽略以获得“哑光月表”。

成功标志：随着太阳向量改变，弦月/上弦/满月的视觉逻辑正确。

保留法线/视角相关变量

做什么：继续使用标准材质计算好的 normal、geometry, vViewPosition 等，以便你的光照使用真实法线与视角。

成功标志：切换 normal map 能明显改变明暗起伏。

五、与渲染管线的兼容性

色调映射与色彩空间

做什么：保留 tonemapping_fragment 与 colorspace_fragment，最终颜色走引擎管线。

为什么：确保与全场景一致的输出观感。

成功标志：切换 renderer 的色调映射/输出编码时，月球表现与场景一致。

透明度/预乘/深度写入

做什么：按需求设置 transparent/premultipliedAlpha/depthWrite/depthTest；月球一般保持默认不透明、写深度。

成功标志：与地球前后遮挡关系正确，不出现奇怪叠加边。

阴影（若一定要）

做什么：如仅要月球“投影到地球”而不受地球灯光照明：在多通道方案中处理（第一通道你自己的着色，第二通道只投影/只写深度）。

成功标志：月球不变色但仍能对地球产生几何遮挡或阴影效果。

六、运行时控制与调参

统一坐标系

做什么：明确 uSunDirection 所在坐标系（世界/视图/模型），在着色器内与法线一致。

成功标志：仅改动一个地方即可修正方向；不会出现“转动相机月相也变”的错觉（除非你设计如此）。

月相驱动

做什么：把“地-月-日”相对几何转换为 uSunDirection（和可选 uPhase），月相 = 仅由几何决定，不受场景光源影响。

成功标志：只改几何/日期，月相正确推进；场景灯光怎么变都不影响月球。

性能与回退

做什么：确认无额外多通道开销；若需后期只对地球生效，才引入多通道/多 RenderPass。

成功标志：与原单通道渲染帧率基本一致。

七、验证用例（最小集）

无灯光场景：场景灯光全关 → 月球仍可见（由自定义光照）；地球一片黑。

强光干扰：往场景添加多个点光/聚光/环境光 → 月球外观零变化。

切换 env：切换 scene.environment 多种 HDR → 月球零变化，地球明显变化。

法线贴图生效：更换月球 normal map → 明暗纹理起伏明显变化。

日向变化：改变 uSunDirection → 月相推进符合预期（朔望弦盈亏）。

后期一致：全场做同一后期（色调映射/ACES）时，月球不“跳色”。

八、常见坑与规避

片段替换不彻底：忘记移除某个 light 累加小段，导致某些灯光仍“漏进来”。→ 逐段搜索/替换，打印编译后的 shader 复核。

envMap 漏挂：材质上残留 envMap 或全局 scene.environment 影响月球。→ 彻底分离。

坐标系不一致：uSunDirection 与 normal 不同空间。→ 明确并统一到同一空间。

版本漂移：升级 three.js 后 chunk 名变动。→ 锁版本、或维护一个“版本-片段映射表”。