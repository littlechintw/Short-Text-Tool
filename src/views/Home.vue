<template>
  <div class="home">
    <br />
    <v-card
      class="mx-auto"
      min-width="344px"
      max-width="60%"
      style="background-color: #5d6d7e; color: #d7dbdd"
    >
      <h1>Send a text message by a short url!</h1>
    </v-card>
    <br />

    <!-- Fill in the text in this card and send -->
    <v-card
      class="mx-auto"
      min-width="344px"
      max-width="60%"
      v-if="!submitStatus"
      :disabled="form.summit"
    >
      <v-progress-linear
        buffer-value="0"
        :color="progressLinearColor"
        reverse
        stream
        value="0"
      ></v-progress-linear>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit="makeShort"
              onSubmit="return false;"
            >
              <v-textarea
                v-model="text"
                :rules="textRules"
                counter
                maxlength="1500"
                label="Text"
              ></v-textarea>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="makeShort"
              >
                Short it!
              </v-btn>
              <br /><br />
            </v-form>
          </v-col>
        </v-row>
      </v-container>
      <v-progress-linear
        buffer-value="0"
        :color="progressLinearColor"
        stream
        value="0"
      ></v-progress-linear>
    </v-card>

    <v-overlay :value="requestOverlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>

    <!-- Show the final result -->
    <v-card
      class="mx-auto"
      min-width="344px"
      max-width="60%"
      v-if="submitStatus"
    >
      <h1>{{ shortUrl }}</h1>
      <v-btn @click="copyText" :color="copyBtn.color" small>
        <v-icon left dark> mdi-content-copy </v-icon>{{ copyBtn.text }}
      </v-btn>
      <br /><br />
      <a :href="'https://sm.littlechin.tw/#t=' + shortUrl" target="_blank">
        Show it to everyone by Screen Message!
      </a>
    </v-card>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64

export default {
  name: "Home",
  components: {},
  data() {
    return {
      window_height: 700,
      window_width: 1600,
      submitStatus: false,
      sendStatus: false,
      requestOverlay: false,
      valid: true,
      text: "",
      textRules: [(v) => !!v || "Text is required"],
      checkbox: false,
      shortUrl: "N/A",
      copyBtn: {
        color: "info",
        text: "Copy the URL!",
      },
      progressLinearColor: "info",
      form: {
        summit: false,
      },
    }
  },
  methods: {
    makeShort() {
      this.requestOverlay = true;
      if (!this.sendStatus && this.text.length <= 1500) {
        this.sendStatus = true;
        this.progressLinearColor = "red";
        this.form.summit = true;
        let api_url =
          "https://script.google.com/macros/s/AKfycbwS03etsMVVn6w6eP28a5I8WX3c1VbaBNXF17iQjyl0f3DujD6ynqPZ/exec?u=" +
          Base64.encode(this.text);
        this.$axios
          .get(api_url)
          .then((resp) => {
            console.log(resp);
            if (!resp.data.err) {
              this.submitStatus = true;
              this.shortUrl = "s.littlechin.tw/" + resp.data.s;
              this.sendStatus = false;
            }
          })
          .catch((err) => {
            alert(err);
          });
        this.progressLinearColor = "info";
        this.form.summit = false;
        this.requestOverlay = false;
      }
    },
    copyText() {
      navigator.clipboard.writeText('https://' + this.shortUrl);
      this.copyBtn.color = "success";
      this.copyBtn.text = "You copy it!";
    },
  },
  created: function () {
    this.window_height = window.innerHeight;
    this.window_width = window.innerWidth;
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
