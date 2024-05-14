const app = Vue.createApp({
  data() {
    return {
      listBuffets: []
    }
  },
  computed: {},
  async mounted() {
    await this.getBuffets();
  },
  methods: {
    getBuffets: async function () {
      let response = await fetch('http://localhost:3000/api/v1/buffet');
      let data = await response.json();

      console.log(data)

      if (data) {
        data.forEach(item => {
          const buffet = new Object();
          buffet.commercial_name = item.commercial_name;
          this.listBuffets.push(buffet);
        });
      } else {
        console.error("Nenhum resultado encontrado no data");
      }
    }
  }

})

app.mount('#app')