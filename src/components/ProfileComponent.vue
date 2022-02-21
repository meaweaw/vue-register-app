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
                <h3 class="fw-bold mb-2 text-muted text-uppercase text-center">Profile</h3>
                <div class="text-center image">
                  <img
                    :src="($store.state.user.profile)?$store.state.user.profile:$store.state.image"
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

                <h5 class="text-center text-capitalize text-dark mt-2">
                  {{ $store.state.user.firstname }} {{ $store.state.user.lastname }}
                </h5>
                <h6 class="text-center text-capitalize text-muted">
                  @{{ $store.state.user.firstname }}
                </h6>
                <div class="text-center">
                  <span class="badge bg-secondary">Joined {{ moment($store.state.user.createdAt).format("ll") }}</span>
                </div>

                <div class="gap-3 mt-2 icons d-flex flex-row justify-content-center align-items-center">
                  <span class="text-twitter"><i class="fa fa-twitter"></i></span>
                  <span class="text-facebook"><i class="fa fa-facebook-f"></i></span>
                  <span class="text-instagram"><i class="fa fa-instagram"></i></span>
                  <span class="text-linkedin"><i class="fa fa-linkedin"></i></span>
                </div>

                <div class="mt-4">
                  <it-input
                    labelTop="Change Password"
                    prefix-icon="lock"
                    type="password"
                    placeholder="Must have at least 6 characters"
                    v-model="newPassword"
                    :status="v$.newPassword.$invalid ? 'danger' : 'success'"
                    :message="v$.newPassword.$invalid ? v$.newPassword.$silentErrors[0].$message : ''"
                    @keyup.enter="changePassword"
                  />
                </div>

                <div class="mt-3">
                  <it-button block type="primary" @click="changePassword"
                    >Change Password</it-button
                  >
                </div>

                <div class="divider d-flex align-items-center my-2">
                  <p class="text-center fw-bold mx-3 mb-0 text-muted">OR</p>
                </div>

                <div>
                  <it-button block type="danger" @click="logOut">Log Out</it-button>
                </div>
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
import { required, minLength, helpers } from "@vuelidate/validators";
import useValidateChar from "../composables/useValidateChar";

export default {
  setup() {
    const { checkSeqChar } = useValidateChar()
    return {
      v$: useVuelidate(),
      checkSeqChar,
    }
  },
  data() {
    return {
      newPassword: "",
    };
  },
  methods: {
    onFileChange(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        return;
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = (e) => {
          this.$store.commit('setUserProfile', e.target.result);
          this.changeProfile();
        };
      }
    },
    async changeProfile() {
      await this.$axios.post("update-user", {
          id: this.$store.state.user._id,
          profile: this.$store.state.user.profile,
        })
        .then((response) => {
          if (response.data.status) {
            this.$Notification.success({
              duration: 3000,
              title: "Edit Profile",
              text: "Edit Profile Success !!",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Notification.danger({
            duration: 3000,
            title: "Edit Profile",
            text: error,
          });
        });
    },
    async changePassword() {
      if (this.v$.$invalid) {
        this.$Notification.warning({
          duration: 3000,
          title: "Input Invalid.",
          text: `${this.v$.$silentErrors[0].$message}`,
        });
        return;
      }

      await this.$axios.post("change-password", {
          username: this.$store.state.user.username,
          password: this.newPassword,
        })
        .then((response) => {
          if (response.data.status) {
            this.$Notification.success({
              duration: 3000,
              title: "Change Password",
              text: "Change Password Success !!",
            });

            this.newPassword = "";
          } else {
            this.$Notification.warning({
              duration: 3000,
              title: "Change Password",
              text: response.data.message,
            });
          }
        })
        .catch((error) => {
          console.log(error);
          this.$Notification.danger({
            duration: 3000,
            title: "Change Password",
            text: error,
          });
        });
    },
    logOut() {
      this.$store.commit("logOut");
      this.$router.push("/");
    },
  },
  created() {
    if (this.$store.state.accessToken == '') {
      this.$router.push("/");
    }
  },
  validations() {
    return {
      newPassword: {
        required,
        checkSeqChar: helpers.withMessage('Password must not contain 3 sequential letters and/or numbers.', this.checkSeqChar),
        minLength: minLength(6),
      },
    };
  },
};
</script>

<style scoped>
.icons i {
  font-size: 19px;
}
.text-twitter {
  color: #1da1f2;
}
.text-facebook {
  color: #3b5998;
}
.text-instagram {
  background: radial-gradient(
    circle at 30% 107%,
    #fdf497 0%,
    #fdf497 5%,
    #fd5949 45%,
    #d6249f 60%,
    #285aeb 90%
  );
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.text-linkedin {
  color: #2867b2;
}
</style>
