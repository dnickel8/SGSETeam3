<template>
  <v-form v-if="userProfile">
    <v-row justify="center">
      <v-col cols="12" sm="12">
        <v-text-field
          :value="userProfile.username"
          label="Benutzername"
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="6">
        <v-text-field
          :value="userProfile.firstName"
          label="Vorname"
          outlined
          readonly
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          :value="userProfile.lastName"
          label="Nachname"
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="12" sm="12">
        <v-text-field
          :value="userProfile.email"
          label="E-Mail"
          outlined
          readonly
        ></v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: "UserData",
  props: ["userProfile"],
};
</script>
