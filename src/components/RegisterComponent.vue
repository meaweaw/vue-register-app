<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            class="card text-white"
            style="border-radius: 1rem; background-color: rgba(255, 255, 255, 0.5);"
          >
            <div class="card-body p-5">
              <div class="mb-md-5 mt-md-4">
                <h3 class="fw-bold mb-2 text-muted text-uppercase text-center">Register</h3>
                <div class="text-center image">
                  <img
                    :src="(profile != '')?profile:$store.state.image"
                    class="img-lg rounded-circle"
                    height="100"
                    width="100"
                  />

                  <div class="mt-2 d-flex justify-content-center align-items-center">
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
                      v-model="firstname"
                      :status="v$.firstname.$invalid ? 'danger' : 'success'"
                      :message="v$.firstname.$invalid ? v$.firstname.$silentErrors[0].$message : ''"
                    />
                  </div>
                  <div class="mt-2 col-6">
                    <it-input
                      labelTop="Last Name"
                      placeholder="Last Name"
                      v-model="lastname"
                      :status="v$.lastname.$invalid ? 'danger' : 'success'"
                      :message="v$.lastname.$invalid ? v$.lastname.$silentErrors[0].$message : ''"
                    />
                  </div>
                </div>

                <div class="mt-2">
                  <it-input
                    labelTop="Username"
                    prefix-icon="account_circle"
                    placeholder="Unique Username"
                    @keypress="checkAcceptChar($event)"
                    v-model="username"
                    :status="v$.username.$invalid ? 'danger' : 'success'"
                    :message="v$.username.$invalid ? v$.username.$silentErrors[0].$message : ''"
                  />
                </div>

                <div class="mt-2">
                  <it-input
                    labelTop="Password"
                    prefix-icon="lock"
                    type="password"
                    placeholder="Must have at least 6 characters"
                    v-model="password"
                    :status="v$.password.$invalid ? 'danger' : 'success'"
                    :message="v$.password.$invalid ? v$.password.$silentErrors[0].$message : ''"
                  />
                </div>

                <div class="mt-4">
                  <it-button
                    block
                    type="primary"
                    @click="createUser"
                    :loading="$store.state.btnloading"
                    :disabled="$store.state.btndisabled"
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
import useVuelidate from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import useValidateChar from "../composables/useValidateChar";

export default {
  setup() {
    const { checkAcceptChar, checkSeqChar } = useValidateChar()
    return {
      v$: useVuelidate(),
      checkAcceptChar,
      checkSeqChar,
    }
  },
  data() {
    return {
      firstname: "",
      lastname: "",
      profile: "",
      username: "",
      password: "",
    };
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.user.profile = '';
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (e) => {
          this.user.profile = e.target.result;
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

      this.$store.commit('setLoading', true);
      await this.$axios.post("create-user", this.user)
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
      this.$store.commit('setLoading', false);
    },
  },
  created() {
    if (this.$store.state.accessToken != '') {
      this.$router.push("/profile");
    }
  },
  validations() {
    return {
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
    };
  },
};
</script>
