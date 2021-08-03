<template>
  <div class="home">
    <br />
    <v-card
      class="mx-auto"
      min-width="344px"
      max-width="60%"
      style="background-color: #5d6d7e; color: #d7dbdd"
    >
      <h1>{{ $route.params.id }}</h1>
    </v-card>
    <br />

    <v-card
      class="mx-auto"
      min-width="344px"
      max-width="60%"
      v-if="!submitStatus"
      :disabled="form.summit"
    >
      <v-progress-linear
        buffer-value="0"
        :color="progressLinear.color"
        reverse
        stream
        value="0"
      ></v-progress-linear>
      <h1>{{ content }}</h1>
      <br v-show="!form.summit" />
      <v-btn
        @click="copyText"
        :color="copyBtn.color"
        small
        v-show="!form.summit"
      >
        <v-icon left dark> mdi-content-copy </v-icon>{{ copyBtn.text }}
      </v-btn>
      <v-progress-linear
        buffer-value="0"
        :color="progressLinear.color"
        stream
        value="0"
      ></v-progress-linear>
    </v-card>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64

export default {
  name: "Home",
  components: {},
  data: () => ({
    window_height: 700,
    window_width: 1600,
    content: "Loading...",
    copyBtn: {
      color: "info",
      text: "Copy the content!",
    },
    progressLinear: {
      color: "orange",
    },
    form: {
      summit: true,
    },
  }),
  methods: {
    copyText() {
      navigator.clipboard.writeText(this.content);
      this.copyBtn.color = "success";
      this.copyBtn.text = "You copy it!";
    },
  },
  created: function () {
    this.window_height = window.innerHeight;
    this.window_width = window.innerWidth;
    let api_url =
      "https://script.google.com/macros/s/AKfycbz6R4TMVKIdnVyYVWSWxTUnptkwVece8-fF7MXOH_W35GXV_jmiqx7K/exec?s=" +
      this.$route.params.id;
    this.$axios
      .get(api_url)
      .then((resp) => {
        console.log(resp);
        if (!resp.data.err) {
          this.content = Base64.decode(resp.data.t);
          this.progressLinear.color = "info";
          this.form.summit = false;
        } else {
          this.content = resp.data.message;
        }
      })
      .catch((err) => {
        alert(err);
      });
  },
};
</script>

<style>
#home {
  padding: 0px;
  margin: 0px;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border: hidden;
}
</style>
