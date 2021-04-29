<template>
    <div id="profil-div" class="d-flex flex-column justify-content-center align-items-center mt-5">
        <form @submit.prevent="" class="b p-3 d-flex flex-column col-11" enctype="multipart/form-data">
            <span class="font align-self-center">Modifier mon mot de passe</span>
            <div class="p-3 d-flex flex-column mt-3 mb-3">
                <div class="mb-3">
                    <label for="OPW">Ancient mot de passe :</label>
                    <input
                    ref="oldpass" 
                    class="form-control" 
                    type="password"
                    name="password"
                    id="OPW"
                    >
                </div>
                <div class="mb-3">
                    <label for="NPW">Nouveau mot de passe :</label>
                    <input
                    ref="newpass" 
                    class="form-control" 
                    type="password"
                    name="password"
                    id="NPW"
                    >
                </div>
                <button @click="sendPW" class="align-self-center btn btn-primary mt-2">Changer le mot de passe</button>
            </div>
            <span class="font font align-self-center">Modifier mon image de profile</span>
                <div class="align-self-center mt-3">
                    <img ref="img" class="rounded-circle border" src="" alt="photo" width="95" height="100">
                </div>
            <div class="mt-4 d-flex justify-content-center">
                <button @click="triggeredInputFile" class="btn btn-success" type="button">
                    <label ref="label">Envoyer un fichier</label>
                    <input
                    type="file"
                    name="file"
                    ref="inputfile"
                    class="d-none"
                    @change="selectFile"
                    />
                </button>
                <div ref="btn" class="mt-1 ml-2 d-none">
                    <button @click="sendFile" type="button" class="btn btn-primary mr-1"><i class="fas fa-upload"></i></button>
                    <button @click="removeFile" type="button" class="btn btn-danger ml-1">X</button>
                </div>
            </div>
        </form>
        <div class="mt-5">
            <button @click="comeBack" class="btn btn-primary">Retour</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
     data() {
        return {
            userName: sessionStorage.getItem('userName'),
        }
    },
    
    methods: {
         comeBack() {
            this.$router.push('/mur')
        },
        triggeredInputFile() {
            this.$refs.inputfile.click()
        },
        selectFile() {
            this.$refs.label.textContent = this.$refs.inputfile.files[0].name
            this.$refs.btn.classList.remove('d-none')
        },
        removeFile() {
            this.$refs.label.textContent = 'Envoyer un fichier'
            this.$refs.inputfile.value = ''
            this.$refs.btn.classList.add('d-none')
        },
        sendPW() {
            let data = new FormData();
            data.append('oldpass', this.$refs.oldpass.value)
            data.append('newpass', this.$refs.newpass.value)

            axios.post("http://localhost:5000/user/profil/modify-password", data)
            .then(() => {
                console.log("Mot de passe changé !");
            })
            .catch(err => {
                console.log(err.response.data)
            })
        },
        sendFile() {
            let file = this.$refs.inputfile.files[0]
            let data = new FormData();
            data.append('file', file)

            axios.post("http://localhost:5000/user/profil/modify-picture", data)
            .then((res) => {
                console.log("Image de profile changé !");
                sessionStorage.setItem('profilPicture', res.data)
                this.$store.state.profilPicture = res.data
                this.$refs.img.src = res.data
                this.removeFile()
            })
            .catch(err => {
                console.log(err.response.data)
            })
        }
    },
    mounted() {
        let token = sessionStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        this.$refs.img.src = sessionStorage.getItem('profilPicture')
    },
}
</script>

<style scoped>

label {
    margin: 0;
    cursor: pointer;
}

.font {
    color: rgba(0, 105, 217, 1);
    font-weight: 600;
    font-size: 18px;
    border-bottom: solid 1px rgba(0, 105, 217, 0.5);
}

.b {
    background-color: rgba(214, 205, 205, 0.8);
    border-radius: 5px;
    width: 500px;
}
</style>