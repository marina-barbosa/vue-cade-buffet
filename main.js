const app = Vue.createApp({
  data() {
    return {
      url: 'http://localhost:3333',
      searchText: '',
      listBuffets: [],
      selectedBuffet: null,
      guests: null,
      date: null,
    }
  },
  computed: {
    listResult: function () {
      if (this.searchText) {
        return this.listBuffets.filter(buffet => {
          return buffet.commercial_name.toLowerCase().includes(this.searchText.toLowerCase())
        });
      } else {
        return this.listBuffets;
      }
    }
  },
  async mounted() {
    await this.getBuffets();
  },
  methods: {
    getBuffets: async function () {      
      let response = await fetch(`${this.url}/api/v1/buffet`);
      let data = await response.json();

      console.log(data)

      if (data) {
        data.forEach(item => {
          const buffet = new Object();
          buffet.id = item.id;
          buffet.commercial_name = item.commercial_name;
          this.listBuffets.push(buffet);
        });
      } else {
        console.error("Nenhum resultado encontrado no data");
      }
    },
    async loadDetails(id) {
      let buffetResponse = await fetch(`${this.url}/api/v1/buffet/${id}`);
      let buffetData = await buffetResponse.json();

      let eventsResponse = await fetch(`${this.url}/api/v1/buffet/${id}/event`);
      let eventsData = await eventsResponse.json();

      console.log(buffetData)
      console.log(eventsData)

      this.selectedBuffet = {
        ...buffetData,
        events: eventsData
      };
    },
    async checkAvailability(eventId, date, guests) {
      console.log(eventId)
      console.log(date)
      console.log(guests)
      try {
        const response = await fetch(`${this.url}/api/v1/check_availability`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event_id: eventId,
            date: date,
            guest_count: guests
          })
        });
        let res = await response.json();

        if (!response.ok) {
          console.log('E01: Evento Indisponivel.')
          alert('E01: Evento Indisponivel.')
        } else {
          console.log(`${res.message}, R$${res.final_value}`);
          alert(`${res.message}, R$${res.final_value}`);
        }

      } catch (error) {
        console.log(`E02: Evento Indisponivel.`);
        alert(`E02: Evento Indisponivel.`);
      }
    }
  }

})

app.mount('#app')