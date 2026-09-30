// Shared unchanged kernels: evaluate once in UV space, reuse in the Earth material.
export const terrainAOGLSL = `
        float calculateAO(vec2 uv, sampler2D heightMap, int steps, float stepDistance, float heightThreshold, float distanceAttenuation, float maxOcclusion, float smoothFactor) {
          if (steps <= 0) return 1.0;

          // 使用8个方向进行采样，计算平均高度差
          vec2 directions[8];
          directions[0] = vec2(1.0, 0.0);
          directions[1] = vec2(0.7071, 0.7071);
          directions[2] = vec2(0.0, 1.0);
          directions[3] = vec2(-0.7071, 0.7071);
          directions[4] = vec2(-1.0, 0.0);
          directions[5] = vec2(-0.7071, -0.7071);
          directions[6] = vec2(0.0, -1.0);
          directions[7] = vec2(0.7071, -0.7071);

          float currentHeight = texture2D(heightMap, uv).r;
          float totalOcclusion = 0.0;
          float validSamples = 0.0;

          // 对每个方向计算AO
          for (int dir = 0; dir < 8; dir++) {
            float dirOcclusion = 0.0;
            float maxHeightDiff = 0.0;

            for (int i = 1; i <= steps; i++) {
              if (i > steps) break;

              vec2 sampleUV = uv + directions[dir] * stepDistance * float(i);
              float sampleHeight = texture2D(heightMap, sampleUV).r;

              // 计算高度差
              float heightDiff = sampleHeight - currentHeight;
              maxHeightDiff = max(maxHeightDiff, heightDiff);

              if (heightDiff > heightThreshold) {
                // 距离衰减 - 使用更强的衰减
                float distanceFactor = pow(1.0 - (float(i) / float(steps)), distanceAttenuation);
                // 遮挡强度 - 增强效果
                float occlusion = clamp(heightDiff * distanceFactor * maxOcclusion * 8.0, 0.0, maxOcclusion);

                // 平滑处理 - 更锐利的过渡
                occlusion *= smoothstep(heightThreshold, heightThreshold * 1.5, heightDiff);

                dirOcclusion += occlusion;
              }
            }

            // 如果该方向有明显的地势升高，增加额外的遮挡
            if (maxHeightDiff > heightThreshold * 2.0) {
              dirOcclusion += maxHeightDiff * maxOcclusion * 2.0;
            }

            totalOcclusion += dirOcclusion;
            validSamples += 1.0;
          }

          // 计算平均AO并应用平滑因子
          float avgOcclusion = totalOcclusion / max(validSamples, 1.0);
          float ao = 1.0 - smoothstep(0.0, smoothFactor, avgOcclusion);
          return max(ao, 0.15); // 确保最小亮度
        }
`;

export const nightGlowGLSL = `
        vec3 sampleNightGlow(sampler2D nightMap, vec2 uv, float blur) {
          if (blur <= 0.0) return texture2D(nightMap, uv).rgb;

          vec3 color = vec3(0.0);
          float totalWeight = 0.0;

          // 根据模糊强度动态选择核大小
          if (blur < 0.003) {
            // 小模糊：3x3核
            float weights3x3[9];
            weights3x3[0] = 0.0625; weights3x3[1] = 0.125; weights3x3[2] = 0.0625;
            weights3x3[3] = 0.125;  weights3x3[4] = 0.25;  weights3x3[5] = 0.125;
            weights3x3[6] = 0.0625; weights3x3[7] = 0.125; weights3x3[8] = 0.0625;

            float scale3 = blur * 0.1;
            for (int i = 0; i < 9; i++) {
              int x = i / 3 - 1;
              int y = i % 3 - 1;
              vec2 offset = vec2(float(x), float(y)) * scale3;
              color += texture2D(nightMap, uv + offset).rgb * weights3x3[i];
              totalWeight += weights3x3[i];
            }
          } else if (blur < 0.008) {
            // 中等模糊：5x5核
            float weights5x5[25];
            weights5x5[0] = 0.003765; weights5x5[1] = 0.015019; weights5x5[2] = 0.023792; weights5x5[3] = 0.015019; weights5x5[4] = 0.003765;
            weights5x5[5] = 0.015019; weights5x5[6] = 0.059912; weights5x5[7] = 0.094907; weights5x5[8] = 0.059912; weights5x5[9] = 0.015019;
            weights5x5[10] = 0.023792; weights5x5[11] = 0.094907; weights5x5[12] = 0.150342; weights5x5[13] = 0.094907; weights5x5[14] = 0.023792;
            weights5x5[15] = 0.015019; weights5x5[16] = 0.059912; weights5x5[17] = 0.094907; weights5x5[18] = 0.059912; weights5x5[19] = 0.015019;
            weights5x5[20] = 0.003765; weights5x5[21] = 0.015019; weights5x5[22] = 0.023792; weights5x5[23] = 0.015019; weights5x5[24] = 0.003765;

            float scale5 = blur * 0.05;
            for (int i = 0; i < 25; i++) {
              int x = i / 5 - 2;
              int y = i % 5 - 2;
              vec2 offset = vec2(float(x), float(y)) * scale5;
              color += texture2D(nightMap, uv + offset).rgb * weights5x5[i];
              totalWeight += weights5x5[i];
            }
          } else {
            // 大模糊：7x7核 (σ = 1.5)
            float weights7x7[49];
            // 7x7高斯权重 (σ = 1.5)
            weights7x7[0] = 0.000843; weights7x7[1] = 0.003898; weights7x7[2] = 0.009949; weights7x7[3] = 0.013690; weights7x7[4] = 0.009949; weights7x7[5] = 0.003898; weights7x7[6] = 0.000843;
            weights7x7[7] = 0.003898; weights7x7[8] = 0.018016; weights7x7[9] = 0.045991; weights7x7[10] = 0.063242; weights7x7[11] = 0.045991; weights7x7[12] = 0.018016; weights7x7[13] = 0.003898;
            weights7x7[14] = 0.009949; weights7x7[15] = 0.045991; weights7x7[16] = 0.117380; weights7x7[17] = 0.161509; weights7x7[18] = 0.117380; weights7x7[19] = 0.045991; weights7x7[20] = 0.009949;
            weights7x7[21] = 0.013690; weights7x7[22] = 0.063242; weights7x7[23] = 0.161509; weights7x7[24] = 0.222242; weights7x7[25] = 0.161509; weights7x7[26] = 0.063242; weights7x7[27] = 0.013690;
            weights7x7[28] = 0.009949; weights7x7[29] = 0.045991; weights7x7[30] = 0.117380; weights7x7[31] = 0.161509; weights7x7[32] = 0.117380; weights7x7[33] = 0.045991; weights7x7[34] = 0.009949;
            weights7x7[35] = 0.003898; weights7x7[36] = 0.018016; weights7x7[37] = 0.045991; weights7x7[38] = 0.063242; weights7x7[39] = 0.045991; weights7x7[40] = 0.018016; weights7x7[41] = 0.003898;
            weights7x7[42] = 0.000843; weights7x7[43] = 0.003898; weights7x7[44] = 0.009949; weights7x7[45] = 0.013690; weights7x7[46] = 0.009949; weights7x7[47] = 0.003898; weights7x7[48] = 0.000843;

            float scale7 = blur * 0.03;
            for (int i = 0; i < 49; i++) {
              int x = i / 7 - 3;
              int y = i % 7 - 3;
              vec2 offset = vec2(float(x), float(y)) * scale7;
              color += texture2D(nightMap, uv + offset).rgb * weights7x7[i];
              totalWeight += weights7x7[i];
            }
          }

          return color / totalWeight;
        }
`;
