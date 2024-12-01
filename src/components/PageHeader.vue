<template>
    <section class="content-header">

        <h1>{{navTitle}}</h1>
         <h4>{{disId}}</h4>

    </section>
</template>

<script>
    export default {
        name: "PageHeader",

        computed: {
        disUser() {
            return this.$store.state.disUser;
        },
        disId() {
            return this.$store.state.disUser.nxDistributerEntity.nxDistributerId;
        },
        navTitle() {
            return this.$store.state.disUser.nxDistributerEntity.nxDistributerName;
        },
    },
        data(){
            return{
                // navTitle : "京京送货"

        }
        }
    }
</script>

<style scoped >

.content-header{
    background: linear-gradient(to right, #6a11cb, #2575fc);
    color: #fff;
    text-align: center;

}

</style>
