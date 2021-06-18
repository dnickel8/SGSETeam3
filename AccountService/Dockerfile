ENV KEYCLOAK jboss/keycloak
ENV KEYCLOAK_VERSION 14.0.0

FROM ${KEYCLOAK}:${KEYCLOAK_VERSION}

ENV KEYCLOAK_USER ${{ secrets.KEYCLOAK_USER }}
ENV KEYCLOAK_PASSWORD ${{ secrets.KEYCLOAK_PASSWORD }}
ENV POSTGRES_IP ${{ secrets.GCP_POSTGRES_IP }}
ENV POSTGRES_PASSWORD ${{ secrets.GCP_POSTGRES_PASSWORD }}

# Import Keycloak realm/users 
COPY ./realm-config /etc/core-realm.json 

# Keycloak config 
ENV KEYCLOAK_LOGLEVEL DEBUG 
ENV ROOT_LOGLEVEL DEBUG 
ENV PROXY_ADDRESS_FORWARDING true 

# Keycloak users 
ENV KEYCLOAK_USER $KEYCLOAK_USER 
ENV KEYCLOAK_PASSWORD $KEYCLOAK_PASSWORD 

# Database config 
ENV DB_VENDOR postgres 
ENV DB_ADDR $POSTGRES_IP 
ENV DB_DATABASE keycloak 
ENV DB_USER keycloak 
ENV DB_PASSWORD $POSTGRES_PASSWORD 
ENV KEYCLOAK_IMPORT /etc/core-realm.json 


ENV JAVA_OPTS -server \ 
-Xms256m \ 
-Xmx2048m \ 
-XX:MetaspaceSize=96M \ 
-XX:MaxMetaspaceSize=256m \ 
-Djboss.modules.system.pkgs=org.jboss.byteman \ 
-Djava.awt.headless=true \ 
-Djava.net.preferIPv4Stack=true \ 
-Dkeycloak.migration.strategy=OVERWRITE_EXISTING \ 
-Dkeycloak.profile.feature.upload_scripts=enabled

EXPOSE 8080
