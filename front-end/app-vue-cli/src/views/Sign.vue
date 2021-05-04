<template>
  <div id="sign">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-10 col-sm-5 col-md-8 col-lg-6 jumbotron form-transparence">
          <form @submit.prevent="checkForm">
            <div class="form-group">
                <p v-if="errors.length">
                <b>Veuillez résoudre les problèmes suivant :</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error}}</li>
                </ul>
                </p>
              <label for="username">Nom d'utilisateur</label>
              <input
                type="username"
                class="form-control"
                id="username"
                name="username"
                v-model="username"
              />
            </div>
            <div class="form-group">
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
            <button type="submit" class="btn btn-primary">
              Inscription
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="bloc-modale" v-if="show">
      <div class="overlay" @click="closeModal"></div>
      <div class="modale card">
        <div class="btn-modale btn btn-danger" @click="closeModal">X</div>
        <h2><i class="fas fa-check color mr-2"></i>Inscription réussie</h2>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "Sign",
   data() {
    return {
      errors: [],
      email: null,
      username: null,
      password: null,
      show: false
    }
  },
  methods: {
    closeModal() {
      this.show = false
      this.$router.push('/login')
    },
    checkForm() {

      if (this.email && this.password && this.username) {
          axios.post('http://localhost:5000/user/register', {
            userName: this.username,
            email: this.email,
            password: this.password
          })
          .then(() => {
            this.show = true
          })
          .catch(err => {
            this.errors = [];
            
            if(err.response.status === 400) {
              this.errors.push(err.response.data.error);
            } else {
              this.errors.push(err.response.data);
            }
          }) 
        }

      this.errors = []

      if (!this.username) {
        this.errors.push('Nom d\'utilisateur requis.');
      }
      if (!this.email) {
        this.errors.push('Email requis.');
      }
      if (!this.password) {
        this.errors.push('Mot de passe requis.');
      }
    }
  }
};
</script>

<style  scoped lang="scss">

.form-transparence{
    background-color: rgba(188, 184, 184, 0.8);
}

ul{
  list-style: none;
  color: red;
  padding: 0;
}

.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background: rgba(0,0,0,0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: #f1f1f1;
  color: #333;
  padding: 60px;
  width: 370px;
  position: fixed;
  top: 30%;
}

.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}

.color {
  color: green;
}

h2 {
  font-size: 17px;
  text-align: center;
}

@media screen and (max-width: 570px) {
  .modale {
    width: 310px;
  }
}
</style>
