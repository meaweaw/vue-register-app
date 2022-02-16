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
            <div class="card-body p-5 text-center">
              <div class="mb-md-5 mt-md-4">
                <h3 class="fw-bold mb-2 text-muted text-uppercase">Profile</h3>
                <div class="image">
                  <img
                    :src="user.profile"
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

                <h5 class="text-capitalize text-dark mt-2">
                  {{ user.firstname }} {{ user.lastname }}
                </h5>
                <h6 class="text-capitalize text-muted">
                  @{{ user.firstname }}
                </h6>
                <span class="badge bg-secondary">Joined {{ user.joined }}</span>

                <div
                  class="gap-3 mt-2 icons d-flex flex-row justify-content-center align-items-center"
                >
                  <span class="text-twitter"
                    ><i class="fa fa-twitter"></i
                  ></span>
                  <span class="text-facebook"
                    ><i class="fa fa-facebook-f"></i
                  ></span>
                  <span class="text-instagram"
                    ><i class="fa fa-instagram"></i
                  ></span>
                  <span class="text-linkedin"
                    ><i class="fa fa-linkedin"></i
                  ></span>
                </div>

                <div class="mt-4">
                  <it-input
                    labelTop="Change Password"
                    prefix-icon="lock"
                    type="password"
                    placeholder="Must have at least 6 characters"
                    v-model="user.password"
                    :status="v$.user.password.$invalid ? 'danger' : 'success'"
                    :message="v$.user.password.$invalid ? v$.user.password.$silentErrors[0].$message : ''"
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
                  <it-button block type="danger" @click="logOut"
                    >Log Out</it-button
                  >
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
import moment from "moment";
import axios from "axios";
import useVuelidate from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";

const API_URL = "http://localhost:4000/api/";

export default {
  data() {
    return {
      user: {
        _id: "",
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        profile: "https://img.icons8.com/bubbles/100/000000/administrator-male.png",
        joined: "",
      },
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
          this.user.profile = e.target.result;
          this.changeProfile();
        };
      }
    },
    async changeProfile() {
      await axios
        .post(
          API_URL + "update-user",
          {
            id: this.user._id,
            profile: this.user.profile,
          },
          {
            headers: {
              authorization: `JWT ${sessionStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status) {
            let session = JSON.parse(sessionStorage.getItem("username"));
            session.profile = this.user.profile;
            sessionStorage.setItem("username", JSON.stringify(session));

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

      await axios
        .post(
          API_URL + "change-password",
          {
            username: this.user.username,
            password: this.user.password,
          },
          {
            headers: {
              authorization: `JWT ${sessionStorage.getItem("accessToken")}`,
            },
          }
        )
        .then((response) => {
          if (response.data.status) {
            this.$Notification.success({
              duration: 3000,
              title: "Change Password",
              text: "Change Password Success !!",
            });

            this.user.password = "";
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
      sessionStorage.removeItem("username");
      this.$router.push("/");
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
    let checkUsername = JSON.parse(sessionStorage.getItem("username"));
    if (["", null, undefined].includes(checkUsername)) {
      this.$router.push("/");
    } else {
      this.user._id = checkUsername._id;
      this.user.firstname = checkUsername.firstname;
      this.user.lastname = checkUsername.lastname;
      this.user.username = checkUsername.username;
      this.user.joined = moment(checkUsername.createdAt).format("ll");

      if (checkUsername.profile) {
        this.user.profile = checkUsername.profile;
      }
    }
  },
  validations() {
    return {
      user: {
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
