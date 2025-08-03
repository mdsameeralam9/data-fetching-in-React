let cachedPromise;

export const makeAPICall = () => {
    if (!cachedPromise) {
        cachedPromise = fetch('https://dummyjson.com/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(result => {
                if (Array.isArray(result?.products) && result.products.length > 0) {
                    return result.products.map(({ id, title, images }) => ({
                        id,
                        title,
                        image: images?.[0],
                    }));
                }
                return [];
            });
    }

    return cachedPromise;
};
