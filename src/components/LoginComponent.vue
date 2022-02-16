<template>
  <section class="vh-100 gradient-custom">
    <div class="container py-5 h-100">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div
            class="card text-white"
            style="border-radius: 1rem;background-color: rgba(255, 255, 255, 0.5);"
          >
            <div class="card-body p-5 text-center">
              <div class="mb-md-5 mt-md-4">
                <h3 class="fw-bold mb-2 text-muted text-uppercase">Login</h3>

                <div class="mt-2">
                  <it-input
                    labelTop="Username"
                    prefix-icon="account_circle"
                    placeholder="Username"
                    v-model="username"
                  />
                </div>

                <div class="mt-2">
                  <it-input
                    labelTop="Password"
                    prefix-icon="lock"
                    type="password"
                    placeholder="Password"
                    v-model="password"
                    @keyup.enter="getLogin"
                  />
                </div>

                <div class="mt-4">
                  <it-button
                    block
                    type="primary"
                    @click="getLogin"
                    :loading="btnloading"
                    :disabled="btndisabled"
                    >LOGIN</it-button
                  >
                </div>

                <div class="divider d-flex align-items-center my-3">
                  <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>

                <p class="mb-0 text-dark">
                  Don't have an account ? <RouterLink to="/register" class="text-primary fw-bold">Register</RouterLink>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
const API_URL = "http://localhost:4000/api/";

import axios from "axios";

export default {
  data() {
    return {
      username: "",
      password: "",
      btnloading: false,
      btndisabled: false,
    };
  },
  methods: {
    async getLogin() {
      if (this.username == "" || this.password == "") return;

      this.btnloading = true;
      this.btndisabled = true;
      await axios
        .post(API_URL + "check-user", {
          username: this.username,
          password: this.password,
        })
        .then((response) => {
          if (response.data.status) {
            sessionStorage.setItem(
              "username",
              JSON.stringify(response.data.data)
            );

            sessionStorage.setItem(
              "accessToken",
              response.data.accessToken
            );

            this.$Notification.success({
              duration: 3000,
              title: "Login",
              text: "Login Success !!",
            });
            setTimeout(() => {
              this.$router.push("/profile");
            }, 1000);
          } else {
            this.$Notification.warning({
              duration: 3000,
              title: "Login Failed",
              text: "Username or Password Incorrect !!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Notification.danger({
            duration: 3000,
            title: "Login",
            text: error,
          });
        });

      this.btnloading = false;
      this.btndisabled = false;
    },
  },
  created() {
    let checkUsername = sessionStorage.getItem("username");
    if (!["", null, undefined].includes(checkUsername)) {
      this.$router.push("/profile");
    }
  },
};
</script>
