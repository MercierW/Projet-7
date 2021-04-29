<template>
  <div id="app">

      <header>
        <nav id="nav">
          <div class="bg-dark">
            <div class="container d-flex justify-content-between align-items-center">
              <div class="row">
                <img
                  src="images/icon-left-font-monochrome-white.svg"
                  width="200"
                  height="50"
                  alt="logo-groupomania"
                />
              </div>
              <div v-if="!show" ref="dropdownDiv" class="dropdown">
                <div class="d-flex align-items-center">
                  <UserPictureAndName 
                  @dropdown-profil-link="dropdownProfilLink" 
                  />
                  <div ref="arrowDrop" class="rotate-down">
                    <i class="arrow-drop fas fa-sort-up"></i>
                  </div>
                  <span v-if="isAdmin === 1" class="adm ml-3">ADM</span>
                </div>
                <ul class="ul" ref="profilLinkDiv">
                  <li class="li"><router-link class="ml-3 link margin" to="/edit-profil">Mon profile</router-link></li>
                  <li class="li"><router-link class="ml-3 link margin" to="/edit-message">Poster un message</router-link></li>
                  <li class="li"><router-link class="ml-3 link margin" to="/">Déconnexion</router-link></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
      <div v-if="show" class="container-fluid mb-3">
        <div class="row mt-3">
          <div class="col text-right">
            <router-link class="btn btn-primary btn-marg" to="/sign"
              >Inscription</router-link
            >
            <router-link class="btn btn-primary btn-marg" to="/login"
              >Connexion</router-link
            >
          </div>
        </div>
      </div>
      <transition name="slide-fade" mode="out-in">
        <router-view />
      </transition>
  </div>
</template>

<script>
import { mapState } from "vuex";
import UserPictureAndName from '@/components/UserPictureAndName.vue'
export default {
  components: {
    UserPictureAndName,
  },
  data() {
    return {
      pathArray: ['/','/sign', '/login'],
      pathNow: this.pathNowFunction,
    };
  },
  computed: {
    ...mapState(["show", "isAdmin"]),

    pathNowFunction() {
      return window.location.pathname
    } 
  },
  methods: {
    dropdownProfilLink() {
      this.$refs.profilLinkDiv.classList.toggle('visible-for-phone-and-tablet')
      this.$refs.arrowDrop.classList.toggle('rotate-down')
      this.$refs.arrowDrop.classList.toggle('rotate-up')
    },
    documentClick(e) {
      let target = e.target
      if(!this.pathArray.includes(this.pathNow)) {
        if(this.$refs.dropdownDiv && !this.$refs.dropdownDiv.contains(target)) {
          this.$refs.profilLinkDiv.classList.remove('visible-for-phone-and-tablet')
          this.$refs.arrowDrop.classList.add('rotate-down')
          this.$refs.arrowDrop.classList.remove('rotate-up')
        }
      }
    },
  },
  created() {
      document.addEventListener('click', this.documentClick)
      console.log('documentClick (nav) listen')
    },
  mounted() {
    this.$store.dispatch("showOff");
  },
  updated() {
    this.$store.dispatch("showOff");
    this.$store.state.isAdmin = parseInt(sessionStorage.getItem('isAdmin'))
  }
};
</script>

<style  lang="scss">
html {
  height: 100%;
  margin: 0;
}

body {
  height: 100%;
  margin: 0;
  padding-top: 50px;
  background-image: url("./assets/Groupomania-bg.png");
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  background-size: cover;
}

.ul {
  background-color: rgb(52, 58, 64);
  margin-left: 30px;
  position: absolute;
  width: 200px;
  padding: 10px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.1s linear, visibility 0.1s linear;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.li {
  list-style: none;
  padding: 10px;
}

.li:hover {
  background-color: rgb(0, 105, 217);
  border-radius: 10px;
}

#nav {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  z-index: 5;
}

.adm {
    font-size: 8px;
    font-weight: 700;
    color: yellow;
}

.arrow-drop {
    font-size: 16px;
    color: #A3D0FF;
    font-size: 18px;
    font-weight: 600;
}

.rotate-up {
  transform: rotate(0deg);
}

.rotate-down {
  transform: rotate(180deg);
}

.visible-for-phone-and-tablet {
  visibility: visible;
  opacity: 1;
}

.margin {
  margin: 0 !important;
}

.link {
  color: white;
}

.link:hover {
  text-decoration: none;
  color: white;
  opacity: 0.7;
}

.btn-marg {
  margin: 0.5%;
}

.col {
  text-align: center;
}

.slide-fade-enter-active {
  transition: all .5s ease;
}
.slide-fade-leave-active {
  transition: all 0s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(0px);
  opacity: 0;
}

.dropdwon {
  position: relative;
  display: inline-block;
}

</style>