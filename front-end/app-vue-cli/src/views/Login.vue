<template>
  <div id="login">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-10 col-sm-5 col-md-8 col-lg-6 jumbotron form-transparence">
          <form @submit.prevent="checkForm">
            <div class="form-group">
                <p v-if="errors.length">
                <b>Veuillez résoudre les problèmes suivant :</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
                </p>
              <label for="email">Adresse mail</label>
              <input
                type="email"
                class="form-control"
                id="email"
                name="email"
                v-model="email"
                aria-describedby="emailHelp"
              />
              <small id="emailHelp" class="form-text text-muted"
                >Ne partagez jamais votre email</small
              >
            </div>
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input
                type="password"
                class="form-control"
                id="password"
                name="password"
                v-model="password"
              />
            </div>
            <button class="btn btn-primary">
              Connexion
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Login",
  data() {
    return {
      errors: [],
      email: null,
      password: null,
    };
  },

  methods: {
    checkForm() {
      if (this.email && this.password) {
        axios.post('http://localhost:5000/user/login', {
          email: this.email,
          password: this.password
        })
          .then(response => {
            let token = response.data.token
            this.$store.state.profilPicture = response.data.pictureProfilURL
            sessionStorage.setItem('profilPicture', response.data.pictureProfilURL)
            sessionStorage.setItem('userName', response.data.userName)
            sessionStorage.setItem('userId', response.data.userId)
            sessionStorage.setItem('isAdmin', response.data.isAdmin)
            sessionStorage.setItem('token', response.data.token)
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            this.$router.push('/mur')
          })
          .catch(err => {
            this.errors = [];
            console.log(err.response.data)
            if(err.response.status === 403 || err.response.status === 400) {
              this.errors.push(err.response.data.error); 
            } else {
              this.errors.push(err.response.data);
            }
          }) 
        }

      this.errors = [];

      if (!this.email) {
        this.errors.push('Email requis.');
      }
      if (!this.password) {
        this.errors.push('Mot de passe requis.');
      }
    },
  },
};
</script>

<style scoped lang="scss">
.form-transparence {
  background-color: rgba(188, 184, 184, 0.8);
}
ul{
  list-style: none;
  color: red;
  padding: 0;
}
</style>
