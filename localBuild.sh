#!/bin/bash

# This script is used to build a local version where each service is docker built locally

# Array to store the sections that were built and pushed
built_sections=()

# Function to just build the images
build() {
    local folder="$1"
    local image_name="$2"
    local image_tag="$3"
    local dockerfile="$4"

    cd "$folder"
    # Run the docker build
    docker build -t "$image_name" -f "$dockerfile" .
}

# Run build function for each section in parallel
build partic-fe partic-frontend local dockerfile &
build partic-be partic-backend local dockerfile &
build partic-db partic-db local dockerfile &

# Wait for all background processes to finish
wait

#If the push flag is set, push the images to the registry
#Example: ./localBuild.sh push
if [ "$1" == "push" ]; then

    echo "Tag the images to the registry..."
    # Tag the images to the registry
    docker tag "partic-frontend" "zfranke/partic-frontend:latest"
    docker tag "partic-backend" "zfranke/partic-backend:latest"
    docker tag "partic-db" "zfranke/partic-db:latest"
    echo "Pushing images to the registry..."
    # Push the images to the registry
    docker push "zfranke/partic-frontend:latest"
    docker push "zfranke/partic-backend:latest"
    docker push "zfranke/partic-db:latest"
fi

# Print the sections that were built and pushed
echo "Sections built: ${built_sections[@]}"
echo "All sections processed."
