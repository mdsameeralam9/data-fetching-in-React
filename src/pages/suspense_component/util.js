const makeAPICall = async () => {
    try {
        const response = await fetch('https://dummyjson.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();

        if (Array.isArray(result?.products) && result?.products?.length > 0) {
            const formatResponse = result?.products?.map(({ id, title, images }) => ({ id, title, image: images?.[0] }));
            return formatResponse
        }
    } catch (err) {
        throw err;
    }
}


// createResource.js
function createResource(promise) {
    let status = 'pending';
    let result;
    const suspender = promise.then(
        res => {
            status = 'success';
            result = res;
        },
        err => {
            status = 'error';
            result = err;
        }
    );


    return {
        read() {
            if (status === 'pending') throw suspender;
            if (status === 'error') throw result;
            return result;
        }
    };
}


export const productResource = createResource(makeAPICall());