<template>
  <div class="result">
    <div class="container">
      <div class="card">
        <div v-if="loading" class="loading-section">
          <div class="spinner-large"></div>
          <p>Loading your content...</p>
        </div>

        <div v-else-if="error" class="error-section">
          <div class="alert alert-error">
            <div class="alert-icon">❌</div>
            <div class="alert-content">
              <strong>錯誤：</strong> {{ error }}
            </div>
          </div>
          <div class="error-actions">
            <router-link to="/" class="btn btn-primary">
              <span class="icon">🏠</span>
              Go Home
            </router-link>
          </div>
        </div>

        <div v-else class="result-content">
          <!-- 主要內容區域 - 最大重點 -->
          <div class="main-content-section">
            <div class="content-header">
              <div class="content-icon">📄</div>
              <h2>Your Content</h2>
            </div>
            <div class="content-text">{{ result.content }}</div>
            <div class="content-actions">
              <button @click="copyContent" :class="['btn btn-lg', copyContentBtn.class]">
                <span class="icon">{{ copyContentBtn.icon }}</span>
                {{ copyContentBtn.text }}
              </button>
              <a
                :href="`https://sm.littlechin.tw/#t=${encodeURIComponent(result.content)}`"
                target="_blank"
                class="btn btn-info"
              >
                <span class="icon">📺</span>
                Show on Screen
              </a>
            </div>
          </div>

          <!-- 短網址資訊 - 簡潔顯示 -->
          <div class="url-section">
            <div class="url-info">
              <span class="url-label">Short URL:</span>
              <span class="url-value">{{ fullShortUrl }}</span>
              <button @click="copyUrl" :class="['btn btn-sm', copyUrlBtn.class]">
                <span class="icon">{{ copyUrlBtn.icon }}</span>
              </button>
            </div>
          </div>

          <!-- 警告訊息 -->
          <div v-if="result.isUrl" class="alert alert-warning">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <strong>安全警告 / Security Warning:</strong> 此內容似乎是網址。請小心網路釣魚或詐騙連結！<br/>
              This appears to be a URL. Be careful of phishing or scam links!
              <div class="alert-actions">
                <a :href="result.content" target="_blank" rel="noopener noreferrer" class="btn btn-warning">
                  <span class="icon">🔗</span>
                  Open URL in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Result",
  data() {
    return {
      loading: true,
      error: null,
      result: {
        isUrl: false,
        content: ""
      },
      copyUrlBtn: {
        class: "btn-outline",
        icon: "🔗",
        text: "Copy URL",
      },
      copyContentBtn: {
        class: "btn-secondary",
        icon: "📋",
        text: "Copy Content",
      },
    }
  },
  computed: {
    fullShortUrl() {
      return `${window.location.origin}/${this.$route.params.id}`;
    }
  },
  methods: {
    async fetchResult() {
      this.loading = true;
      this.error = null;
      const gasUrl = import.meta.env.VITE_GAS_URL;

      try {
        const payload = {
          action: "get",
          short_id: this.$route.params.id
        };

        // 使用 fetch 搭配 text/plain 避免 CORS 問題
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain',
          },
          mode: 'cors',
          body: JSON.stringify(payload)
        });

        const resData = await response.json();

        if (!resData.err) {
          this.result.isUrl = resData.isUrl;
          this.result.content = resData.t;
        } else {
          this.error = resData.message;
        }
      } catch (err) {
        this.error = "Error: " + err.message;
      } finally {
        this.loading = false;
      }
    },
    copyUrl() {
      navigator.clipboard.writeText(this.fullShortUrl);
      this.copyUrlBtn.class = "btn-success";
      this.copyUrlBtn.icon = "✅";
      this.copyUrlBtn.text = "Copied!";
      setTimeout(() => {
        this.copyUrlBtn.class = "btn-outline";
        this.copyUrlBtn.icon = "🔗";
        this.copyUrlBtn.text = "Copy URL";
      }, 2000);
    },
    copyContent() {
      navigator.clipboard.writeText(this.result.content);
      this.copyContentBtn.class = "btn-success";
      this.copyContentBtn.icon = "✅";
      this.copyContentBtn.text = "Copied!";
      setTimeout(() => {
        this.copyContentBtn.class = "btn-secondary";
        this.copyContentBtn.icon = "📋";
        this.copyContentBtn.text = "Copy Content";
      }, 2000);
    },
  },
  mounted() {
    this.fetchResult();
  },
};
</script>

<style scoped>
.result {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1a 100%);
}

.container {
  max-width: 900px;
  width: 100%;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(0, 212, 255, 0.3);
}

.header-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.page-title {
  color: #00d4ff;
  font-size: 2.8rem;
  margin: 0 0 1rem 0;
  text-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
  font-weight: 700;
}

.short-id-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  color: white;
  border-radius: 25px;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.loading-section,
.error-section {
  text-align: center;
  padding: 4rem 2rem;
}

.loading-section p {
  color: #ffffff;
  margin-top: 2rem;
  font-size: 1.2rem;
}

.spinner-large {
  width: 64px;
  height: 64px;
  border: 5px solid rgba(255, 255, 255, 0.2);
  border-top: 5px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 1px solid;
}

.alert-warning {
  background: rgba(255, 193, 7, 0.15);
  border-color: rgba(255, 193, 7, 0.4);
  color: #ffc107;
}

.alert-error {
  background: rgba(244, 67, 54, 0.15);
  border-color: rgba(244, 67, 54, 0.4);
  color: #f44336;
}

.alert-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  margin-top: 0.2rem;
}

.alert-content strong {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.alert-actions {
  margin-top: 1rem;
}

.url-display {
  background: rgba(0, 212, 255, 0.1);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.2);
}

.url-label {
  color: #00d4ff;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  display: block;
}

.url-chip {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: #e0e0e0;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  word-break: break-all;
  font-size: 1.1rem;
}

.main-content-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 156, 204, 0.1));
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.2);
  position: relative;
  overflow: hidden;
}

.main-content-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #00d4ff, #0099cc);
}

.content-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.content-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: block;
  animation: bounce 2s infinite;
}

.content-header h2 {
  color: #00d4ff;
  font-size: 1.8rem;
  margin: 0;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
  font-weight: 600;
}

.content-text {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #ffffff;
  word-wrap: break-word;
  white-space: pre-wrap;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 1rem;
  font-family: 'Courier New', monospace;
  box-shadow: inset 0 1px 5px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: none;
}

.content-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.url-section {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.url-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.url-label {
  color: #a0a0a0;
  font-size: 0.8rem;
  font-weight: 500;
  flex-shrink: 0;
}

.url-value {
  flex: 1;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  word-break: break-all;
  font-size: 0.9rem;
  min-width: 0;
}

.actions-section {
  text-align: center;
  margin-top: 1.5rem;
}

.actions-section .btn {
  margin: 0 0.5rem 0.5rem 0.5rem;
  min-width: 160px;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  min-width: 140px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
}

.btn-primary {
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  color: white;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 212, 255, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
  box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ff9800, #f57c00);
  color: white;
  box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(0, 212, 255, 0.5);
  color: #00d4ff;
}

.btn-outline:hover {
  background: rgba(0, 212, 255, 0.1);
  border-color: rgba(0, 212, 255, 0.8);
  transform: translateY(-2px);
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.85rem;
}

.icon {
  font-size: 1.2rem;
}

.error-actions {
  margin-top: 2rem;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .card {
    padding: 1.5rem;
    margin: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .main-content-section {
    padding: 1.25rem;
  }

  .content-header h2 {
    font-size: 1.6rem;
  }

  .content-text {
    font-size: 1.1rem;
    padding: 1.25rem;
  }

  .url-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .url-value {
    width: 100%;
    word-break: break-all;
  }

  .actions-section .btn {
    margin: 0.25rem;
    min-width: auto;
    width: 100%;
    max-width: 280px;
  }

  .btn-lg {
    padding: 0.625rem 1.25rem;
    font-size: 0.95rem;
    min-width: auto;
  }
}
</style>
