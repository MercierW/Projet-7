<template>
    <div id="message" class="mt-5 d-flex justify-content-center align-items-center">
        <div class="container  col-md-8 col-lg-8 col-xl-6">
        <form @submit.prevent="" class="bg-custum p-4 rounded" enctype="multipart/form-data">
            <div>
            <p class="p"><pre>{{preview}}</pre></p>
            <textarea @input="updateTextareaHeight" v-model="preview" name="message" id="textarea" class="rounded p-2" placeholder="Écrivez un commentaire..." autocomplete="off" cols="100" rows="2">
            </textarea>
            <div class="d-flex mt-3">
            <button @click="triggeredInputFile" type="button" class="btn btn-success">
                <label v-if="file" class="m-0">{{file.name}}</label>
                <label v-else class="m-0">Joindre un fichier</label>
                    <input
                    @change="selectFile"
                    type="file"
                    name="file"
                    ref="file"
                    class="d-none"
                    id="file"
                    />
            </button>
            <div id="div-btns" class="mt-1 ml-2 d-none">
                <button  type="button" class="btn btn-primary mr-1"><i class="fas fa-upload"></i></button>
                <button @click="removeBtns" type="button" class="btn btn-danger ml-1">X</button>
            </div>
            </div>
            </div>
            <button @click="sendMessage" class="container btn btn-primary mt-3">Poster</button>
        </form>
        <div class="mt-5">
            <button @click="comeBack" class="btn btn-primary">Retour</button>
        </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    name: "EditMessage",
    data() {
        return {
            preview: "",
            file: ""
        }
    },
    methods: {
        comeBack() {
            this.$router.push('/mur')
        },
        updateTextareaHeight(e) {
            let target = e.currentTarget
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
        },
        selectFile() {
            this.file = this.$refs.file.files[0]
            document.getElementById('div-btns').classList.remove('d-none')
        },
        removeBtns() {
            document.getElementById('div-btns').classList.add('d-none')
            document.getElementById('file').value = ""
            this.file = ""
        },
        triggeredInputFile() {
            document.getElementById('file').click()
        },
        sendMessage() {
            let data = new FormData();
            data.append('message', this.preview)
            data.append('file', this.file)

            axios.post('http://localhost:5000/message/new', data)
            .then(() => {
                console.log('Message envoyé')
                this.$router.push('/mur')
            })
            .catch(err => {
                console.log(err.response.data.error)
            })
        }
    },
    mounted() {
        let token = sessionStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
}
</script>

<style scoped lang="scss">

#message {
    height: 50vh;
}

.bg-custum {
    background: rgba(214, 205, 205, 0.8);
}

textarea {
  border-style: none;
  background-color: rgba(214, 205, 205, 0.9);
  resize: none;
  padding: 0px;
  overflow: hidden;
  width: 100%;
}

textarea:focus {
  outline: none;
}

textarea:focus::placeholder {
  opacity: 0.5;
}

pre {
    overflow: hidden;
    white-space : pre-wrap;
}

label:hover {
    cursor: pointer;
}

.p {
    overflow-wrap: break-word;
    font-size: 18px;
}

.btn-danger:hover {
    opacity: 0.7;
}

</style>