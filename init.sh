
# create mongodb and mongo log
mkdir "${PWD}/mongodb"
mkdir "${PWD}/mongodb/dev"
mkdir "${PWD}/mongodb/prod"
mkdir "${PWD}/logs"
mkdir "${PWD}/logs/dev"
mkdir "${PWD}/logs/prod"
touch "${PWD}/logs/dev/mongo.log"
touch "${PWD}/logs/prod/mongo.log"

# create files folder
mkdir files
mkdir files/auddios
mkdir files/videos
mkdir files/images

#create profile folder for browser
mkdir assets
mkdir assets/Profiles