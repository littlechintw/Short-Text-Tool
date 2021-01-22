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
    <v-card class="mx-auto" min-width="344px" max-width="60%">
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <v-form
              ref="form"
              v-model="valid"
              lazy-validation
              @submit="validate"
              onSubmit="return false;"
            >
              <v-text-field
                v-model="text"
                :rules="textRules"
                counter
                maxlength="200"
                label="Text"
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="success"
                class="mr-4"
                @click="validate"
              >
                Short it!
              </v-btn>
              <br /><br />
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <br />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {},
  data: () => ({
    window_height: 700,
    window_width: 1600,
    valid: true,
    text: "",
    textRules: [(v) => !!v || "Text is required"],
    checkbox: false,
  }),
  methods: {
    validate() {
      this.$refs.form.validate();
      // this.$axios
      //   .post(
      //     "https://script.google.com/macros/s/AKfycbwS03etsMVVn6w6eP28a5I8WX3c1VbaBNXF17iQjyl0f3DujD6ynqPZ/exec",
      //     {
      //       u: this.text,
      //     }
      //   )
      //   .then(function (response) {
      //     alert(response);
      //   })
      //   .catch(function (error) {
      //     alert(error);
      //   });
      this.$axios
        .post(
          "https://script.google.com/macros/s/AKfycbwS03etsMVVn6w6eP28a5I8WX3c1VbaBNXF17iQjyl0f3DujD6ynqPZ/exec",
          {
            u: this.text,
          }
        )
        .then((resp) => {
          alert(resp);
        })
        .catch((err) => {
          alert(err);
        });
      alert("ok, " + this.text);
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
