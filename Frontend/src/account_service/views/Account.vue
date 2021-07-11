<template>
  <v-container fill-height fluid>
    <div style="width: 100%">
      <v-row class="d-flex justify-center mb-6">
        <v-card>
          <v-card-title>Mein Konto</v-card-title>
          <v-card-text>
            <user-data :userProfile="userProfile" />
          </v-card-text>
          <v-card-actions>
            <v-btn @click="logout" v-if="$keycloak.authenticated" color="amber">
              Logout
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import UserData from "@/account_service/components/UserData.vue";

export default {
  name: "Account",
  components: {
    UserData,
  },
  data() {
    return {
      userProfile: null,
    };
  },
  methods: {
    async logout() {
      await this.$keycloak.logoutFn();
    },
  },
  async mounted() {
    if (this.$keycloak.authenticated) {
      this.userProfile = await this.$keycloak.loadUserProfile();
    }
  },
};
</script>
