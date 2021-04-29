<template>
    <div class="d-flex align-items-center">
        <div class="mr-3">
            <img ref="img" class="rounded-circle" :src="pictureProfil" alt="profil-picture" width="40" height="40">
        </div>
        <div @click="$emit('dropdown-profil-link')" class="font user-name">
            <span class="mr-1">{{userName}}</span>
        </div>
    </div>
</template>

<script>

export default {
    name: "UserPictureAndName",
    props: ["picture"],
    data() {
        return {
            userName: sessionStorage.getItem('userName'), 
        }
    },
    computed: {
        pictureProfil() {
            return this.$store.state.profilPicture
        }
  },
  mounted() {
      this.$refs.img.src = sessionStorage.getItem('profilPicture')
  }
}
</script>

<style scoped>

.font {
    color: #A3D0FF;
    font-size: 18px;
    font-weight: 600;
}

.user-name {
    cursor: pointer;
}
</style>