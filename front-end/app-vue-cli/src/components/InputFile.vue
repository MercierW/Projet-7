<template>
    <div class="d-flex mt-4">
        <button type="button" class="op btn btn-success">
            <label :for="'file-' + messageId" ref="label">Envoyer un fichier</label>
            <input
            :id="'file-' + messageId"
            type="file"
            name="file"
            ref="inputfile"
            @change="selectFile"
            class="d-none"
            />
        </button>
        <div ref="btn" class="mt-1 ml-2 d-none">
            <button @click="sendFile" type="button" class="btn btn-primary mr-1">Envoyer <i class="fas fa-upload"></i></button>
            <button @click="removeFile" type="button" class="btn btn-danger ml-1">X</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    name: "InputFile",
    props: ["messageId"],
    methods: {

        selectFile() {
            if(this.$refs.inputfile.files[0].name.length - 4 > 10) {
                this.$refs.label.textContent = this.$refs.inputfile.files[0].name.split('', 10).join('') + "...";
            } else {
                this.$refs.label.textContent = this.$refs.inputfile.files[0].name;
            }
            this.$refs.btn.classList.remove('d-none')
        },
         removeFile() {
            this.$refs.label.textContent = 'Envoyer un fichier'
            this.$refs.inputfile.value = ''
            this.$refs.btn.classList.add('d-none')
        },
        sendFile() {
            let file = this.$refs.inputfile.files[0]
            const data = new FormData();
            data.append('file', file)
            data.append('messageId', this.messageId)
            axios
                .post("http://localhost:5000/message/response", data)
                .then(() => {
                    console.log("Fichier envoyé !");
                    this.removeFile()
                    this.$emit('post-file-done')
                })
                .catch((err) => {
                    console.log(err.response.data);
                });
        }
    }
}
</script>

<style scoped>
label {
  margin: 0;
}

label:hover {
  cursor: pointer;
}

.op {
    background-color: #186329;
}

.op:hover {
    background-color: #28A644;
}    
</style>