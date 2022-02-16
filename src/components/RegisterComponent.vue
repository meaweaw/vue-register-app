<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            class="card text-white"
            style="
              border-radius: 1rem;
              background-color: rgba(255, 255, 255, 0.5);
            "
          >
            <div class="card-body p-5">
              <div class="mb-md-5 mt-md-4">
                <h3 class="fw-bold mb-2 text-muted text-uppercase text-center">
                  Register
                </h3>
                <div class="text-center image">
                  <img
                    :src="image"
                    class="img-lg rounded-circle"
                    height="100"
                    width="100"
                  />

                  <div
                    class="mt-2 d-flex justify-content-center align-items-center"
                  >
                    <label
                      for="files"
                      style="cursor: pointer"
                      class="text-muted float-end"
                    >
                      <span class="material-icons">add_photo_alternate</span>
                    </label>
                    <input
                      id="files"
                      type="file"
                      class="d-none"
                      accept="image/*"
                      @change="onFileChange"
                    />
                  </div>
                </div>
                <div class="row">
                  <div class="mt-2 col-6">
                    <it-input
                      labelTop="First Name"
                      placeholder="First Name"
                      v-model="user.firstname"
                      :status="v$.user.firstname.$invalid ? 'danger' : 'success'"
                      :message="v$.user.firstname.$invalid ? v$.user.firstname.$silentErrors[0].$message : ''"
                    />
                  </div>
                  <div class="mt-2 col-6">
                    <it-input
                      labelTop="Last Name"
                      placeholder="Last Name"
                      v-model="user.lastname"
                      :status="v$.user.lastname.$invalid ? 'danger' : 'success'"
                      :message="v$.user.lastname.$invalid ? v$.user.lastname.$silentErrors[0].$message : ''"
                    />
                  </div>
                </div>

                <div class="mt-2">
                  <it-input
                    labelTop="Username"
                    prefix-icon="account_circle"
                    placeholder="Unique Username"
                    @keypress="checkChar($event)"
                    v-model="user.username"
                    :status="v$.user.username.$invalid ? 'danger' : 'success'"
                    :message="v$.user.username.$invalid ? v$.user.username.$silentErrors[0].$message : ''"
                  />
                </div>

                <div class="mt-2">
                  <it-input
                    labelTop="Password"
                    prefix-icon="lock"
                    type="password"
                    placeholder="Must have at least 6 characters"
                    v-model="user.password"
                    :status="v$.user.password.$invalid ? 'danger' : 'success'"
                    :message="v$.user.password.$invalid ? v$.user.password.$silentErrors[0].$message : ''"
                  />
                </div>

                <div class="mt-4">
                  <it-button
                    block
                    type="primary"
                    @click="createUser"
                    :loading="btnloading"
                    :disabled="btndisabled"
                    >REGISTER</it-button
                  >
                </div>

                <div class="divider d-flex align-items-center my-3">
                  <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>

                <p class="mb-0 text-center text-dark">Have an account ? <RouterLink to="/" class="text-primary fw-bold">Login</RouterLink></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";

const API_URL = "http://localhost:4000/api/";

export default {
  data() {
    return {
      user: {
        firstname: "",
        lastname: "",
        profile: "",
        username: "",
        password: "",
      },
      image: "https://img.icons8.com/bubbles/100/000000/administrator-male.png",
      statusUsername: "",
      messageUsername: "",
      statusPassword: "",
      messagePassword: "",
      btnloading: false,
      btndisabled: false,
    };
  },
  methods: {
    checkChar(e) {
      let char = String.fromCharCode(e.keyCode);
      if (/^[A-Za-z0-9_]+$/.test(char)) return true;
      else e.preventDefault();
    },
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.image =
          "https://img.icons8.com/bubbles/100/000000/administrator-male.png";
        this.user.profile = "";
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (e) => {
          this.image = e.target.result;
          this.user.profile = this.image;
        };
      }
    },
    async createUser() {
      if (this.v$.$invalid) {
        this.$Notification.warning({
          duration: 3000,
          title: "Input Invalid.",
          text: `${this.v$.$silentErrors[0].$message}`,
        });
        return;
      }

      this.btnloading = true;
      this.btndisabled = true;
      await axios
        .post(API_URL + "create-user", this.user)
        .then((response) => {
          if (response.data.status) {
            this.$Notification.success({
              duration: 3000,
              title: "Register",
              text: "Register Success !!",
            });
            setTimeout(() => {
              this.$router.push("/");
            }, 1000);
          } else {
            this.$Notification.warning({
              duration: 3000,
              title: "Register",
              text: response.data.message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Notification.danger({
            duration: 3000,
            title: "Register",
            text: error,
          });
        });
      this.btnloading = false;
      this.btndisabled = false;
    },
    checkSeqChar(value) {
      // Check for sequential numerical characters
      for (const key in value) {
        if (+value[+key+1] == +value[key]+1 && +value[+key+2] == +value[key]+2) return false;
      }

      // Check for sequential alphabetical characters
      for (const key in value) {
        if (String.fromCharCode(value.charCodeAt(key)+1) == value[+key+1] && String.fromCharCode(value.charCodeAt(key)+2) == value[+key+2]) return false;
      }

      return true;
    }
  },
  created() {
    let checkUsername = sessionStorage.getItem("username");
    if (!["", null, undefined].includes(checkUsername)) {
      this.$router.push("/profile");
    }
  },
  validations() {
    return {
      user: {
        firstname: {
          required,
          maxLength: maxLength(50),
        },
        lastname: {
          required,
          maxLength: maxLength(50),
        },
        username: {
          required,
          maxLength: maxLength(12),
        },
        password: {
          required,
          checkSeqChar: helpers.withMessage('Password must not contain 3 sequential letters and/or numbers.', this.checkSeqChar),
          minLength: minLength(6),
        },
      },
    };
  },
  setup: () => ({ v$: useVuelidate() }),
};
</script>
