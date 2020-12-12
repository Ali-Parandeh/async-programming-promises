import setText, {appendText} from "./results.mjs";

export function timeout() {
    // Once a promise is settled, its status will not change anymore or return anything.
    const wait = new Promise((resolve) => {
        setTimeout(() => {
            resolve("Timeout!");
        }, 1500);
    })

    wait.then(text => setText(text));
}

export function interval() {
    let counter = 0;
    const wait = new Promise((resolve) => {
        setInterval(() => {
            console.log("INTERVAL!");
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    })

    wait.then(text => setText(text))
        // Use finally to do something once a promise is settled.
        .finally(() => {
            appendText(` -- DONE ${counter}`);
        });
}

export function clearIntervalChain() {
    let counter = 0;
    let interval;
    const wait = new Promise((resolve) => {
        interval = setInterval(() => {
            console.log("INTERVAL!");
            resolve(`Timeout! ${++counter}`);
        }, 1500);
    })

    wait.then(text => setText(text))
        .finally(() => {
            clearInterval(interval);
        });
}


export function xhr() {
    // Resolve or Reject a promise based on your own logic
    let request = new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "http://localhost:3000/users/1");
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(xhr.statusText);
            }
        }
        xhr.onerror = () => reject("Request Failed");
        xhr.send();
    });

    request.then(result => setText(result))
        .catch(reason => setText(reason));
}

export function allPromises() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

//    Queue up all promises and wait until all resolve or one rejects. If one rejects, settle the promise.
    Promise.all([categories, statuses, userTypes, addressTypes])
        .then(([cat, stat, type, address]) => {
            setText("");
            appendText(JSON.stringify(cat.data));
            appendText(JSON.stringify(stat.data));
            appendText(JSON.stringify(type.data));
            appendText(JSON.stringify(address.data));
        }).catch(reason => setText(reason));
}

export function allSettled() {
    let categories = axios.get("http://localhost:3000/itemCategories");
    let statuses = axios.get("http://localhost:3000/orderStatuses");
    let userTypes = axios.get("http://localhost:3000/userTypes");
    let addressTypes = axios.get("http://localhost:3000/addressTypes");

//    Queue up all promises and return their status even if they are ejected.
//    Settle the promise once all have been settled. (Fulfilled or rejected)
    Promise.allSettled([categories, statuses, userTypes, addressTypes])
        .then(values => {
            let results = values.map(v => {
                if (v.status === 'fulfilled'){
                    return `FULFILLED: ${JSON.stringify(v.value.data[0])} `;
                }

                return `REJECTED: ${v.reason.message} `;
            })
            setText(results)
        }).catch(reason => setText(reason));
}

export function race() {
    let users = axios.get("http://localhost:3000/users");
    let backup = axios.get("http://localhost:3001/users");

    // Use Promise.race to settle a promise via multiple API calls as fast as possible.
    // Once one is settled, the settlement of the other promises are ignored.
    // If one of the promises is rejected, it is ignored unless all promises are rejected, in that case
    // Promise.race is also rejected.
    Promise.race([users, backup])
        .then(users => setText(JSON.stringify(users.data)))
        .catch(reason => setText(reason));
}
