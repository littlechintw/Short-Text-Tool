<template>
  <div class="home">
    <div class="container">
      <div class="card title-card">
        <h1>Send a text message by a short url!</h1>
      </div>

      <div v-if="!submitStatus" class="card form-card">
        <form @submit.prevent="makeShort" class="form">
          <div class="form-group">
            <label for="text-input" class="form-label">Enter your text or URL</label>
            <textarea
              id="text-input"
              v-model="text"
              :class="['form-textarea', { 'error': !valid }]"
              placeholder="Enter your text or URL"
              maxlength="1500"
              rows="4"
              required
            ></textarea>
            <div class="char-count">{{ text.length }}/1500</div>
          </div>

          <div v-if="!valid && touched" class="error-message">Text is required</div>

          <button
            type="submit"
            :disabled="!valid || loading"
            class="btn btn-primary"
          >
            <span v-if="loading" class="spinner"></span>
            Short it!
          </button>
        </form>
      </div>

      <div v-if="loading" class="overlay">
        <div class="spinner-large"></div>
      </div>

      <div v-if="submitStatus" class="card result-card">
        <div class="success-message">
          <div class="success-icon">✅</div>
          <h2>Short URL Created!</h2>
        </div>

        <div class="url-display">
          <div class="url-chip">{{ result.shortUrl }}</div>
          <button @click="copyUrl" :class="['btn btn-sm', copyUrlBtn.class]">
            <span class="icon">{{ copyUrlBtn.icon }}</span>
            {{ copyUrlBtn.text }}
          </button>
        </div>

        <div class="result-actions">
          <a :href="result.shortUrl" target="_blank" class="btn btn-success">
            <span class="icon">🔗</span>
            Open Short URL
          </a>
          <a
            :href="`https://sm.littlechin.tw/#t=${encodeURIComponent(result.content)}`"
            target="_blank"
            class="btn btn-info"
          >
            <span class="icon">📺</span>
            Show on Screen Message
          </a>
        </div>

        <div class="original-content">
          <h3>Original Content:</h3>
          <div class="content-chip">{{ result.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      text: "",
      valid: false,
      touched: false,
      loading: false,
      submitStatus: false,
      result: {
        isUrl: false,
        content: "",
        shortUrl: "",
        shortId: ""
      },
      copyBtn: {
        class: "btn-secondary",
        icon: "📋",
        text: "Copy Content",
      },
      copyUrlBtn: {
        class: "btn-outline",
        icon: "🔗",
        text: "Copy URL",
      },
    };
  },
  watch: {
    text() {
      this.valid = this.text.trim().length > 0;
      this.touched = true;
    },
  },
  methods: {
    async makeShort() {
      if (!this.valid) return;

      this.loading = true;
      this.submitStatus = false; // 先重置狀態
      const gasUrl = import.meta.env.VITE_GAS_URL;

      try {
        const payload = {
          action: "create",
          content: this.text.trim()
        };

        // 使用 fetch 取代 form submit
        const response = await fetch(gasUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain', // 關鍵：用 text/plain 避免觸發難搞的 Preflight OPTIONS 請求
          },
          mode: 'cors',
          body: JSON.stringify(payload)
        });

        const resData = await response.json();

        if (resData.err === false) {
          // 成功拿到短碼
          this.result.isUrl = resData.isUrl;
          // 組合完整的短網址
          const shortUrl = `${window.location.origin}/${resData.s}`;
          this.result.content = resData.t; // 原始內容
          this.result.shortUrl = shortUrl; // 短網址
          this.result.shortId = resData.s; // 短碼
          this.submitStatus = true;
        } else {
          throw new Error(resData.message);
        }

      } catch (err) {
        console.error('API 呼叫失敗:', err);
        this.result.content = '錯誤: ' + err.message;
        this.submitStatus = true;
      } finally {
        this.loading = false;
      }
    },
    copyText() {
      navigator.clipboard.writeText(this.result.content);
      this.copyBtn.class = "btn-success";
      this.copyBtn.icon = "✅";
      this.copyBtn.text = "Copied!";
      setTimeout(() => {
        this.copyBtn.class = "btn-secondary";
        this.copyBtn.icon = "📋";
        this.copyBtn.text = "Copy Content";
      }, 2000);
    },
    copyUrl() {
      navigator.clipboard.writeText(this.result.shortUrl);
      this.copyUrlBtn.class = "btn-success";
      this.copyUrlBtn.icon = "✅";
      this.copyUrlBtn.text = "Copied!";
      setTimeout(() => {
        this.copyUrlBtn.class = "btn-outline";
        this.copyUrlBtn.icon = "🔗";
        this.copyUrlBtn.text = "Copy URL";
      }, 2000);
    },
  },
};
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  width: 100%;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.title-card h1 {
  color: #00d4ff;
  font-size: 2.5rem;
  margin: 0;
  text-align: center;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.form-card {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  color: #e0e0e0;
  font-weight: 500;
  font-size: 1.1rem;
}

.form-textarea {
  padding: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: #e0e0e0;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-textarea:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.2);
}

.form-textarea.error {
  border-color: #f44336;
}

.char-count {
  align-self: flex-end;
  color: #a0a0a0;
  font-size: 0.9rem;
}

.error-message {
  color: #f44336;
  font-size: 0.9rem;
  margin-top: -1rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
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
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-success {
  background: linear-gradient(135deg, #4caf50, #388e3c);
  color: white;
}

.btn-info {
  background: linear-gradient(135deg, #2196f3, #1976d2);
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
}

.btn:hover {
  transform: translateY(-2px);
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.spinner-large {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result-card {
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.success-message {
  text-align: center;
  margin-bottom: 2rem;
}

.success-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.success-message h2 {
  color: #00d4ff;
  margin: 0;
  font-size: 1.5rem;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
}

.url-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.url-chip {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(0, 212, 255, 0.1);
  border: 2px solid rgba(0, 212, 255, 0.3);
  border-radius: 8px;
  color: #00d4ff;
  font-family: 'Courier New', monospace;
  font-weight: 500;
  word-break: break-all;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-outline {
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: #e0e0e0;
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.result-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.original-content {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.original-content h3 {
  color: #e0e0e0;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.icon {
  font-size: 1.2rem;
}
</style>
