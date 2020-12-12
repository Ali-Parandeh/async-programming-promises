import setText, { appendText } from "./results.mjs";

export async function get(){
    const {data} = await axios.get("http://localhost:3000/orders/1");
    setText(JSON.stringify(data));
}

export async function getCatch(){
    try{
        const {data} = await axios.get("http://localhost:3000/orders/123");
        setText(JSON.stringify(data));
    } catch(error){
        setText(error);
    }
}

export async function chain(){
    // Create the promise and wait sequentially until one completes after another
    // The main benefit of async await is that we can get access to returns of promises one by one
    // Compared to promise chaining approach .then(x=>x).then(y=>y) which prevents us from accessing x inside
    // the second .then()
    // https://blog.logrocket.com/promise-chaining-is-dead-long-live-async-await-445897870abc/
    const { data } = await axios.get("http://localhost:3000/orders/1");
    const { data: address } = await axios.get(
        `http://localhost:3000/addresses/${data.shippingAddress}`
    );
    setText(`City: ${JSON.stringify(address.city)}`);
}

export async function concurrent(){
    // Create the promises at the same time but don't wait for them until you need their returns
    const orderStatuses = axios.get("http://localhost:3000/orderStatuses");
    const orders = axios.get("http://localhost:3000/orders");

    setText("");

    // Once rest of code is run, we now need their returns even if they're not returned yet,
    // So we'll wait for them here to return before rest of code can be executed.
    const { data: statuses } = await orderStatuses;
    const { data: order } = await orders;

    appendText(JSON.stringify(statuses));
    appendText(JSON.stringify(order[0]));
}

export async function parallel(){
    // We execute all 2 promises at the same time and get the return of all promise once all returned.
    // However the trick here is that we can execute the inner promises and have them do something in parallel
    // For example here, we make them each append the text as they settle.
    setText("");
    await Promise.all([
        (async () => {
            const { data } = await axios.get("http://localhost:3000/orderStatuses");
            appendText(JSON.stringify(data));
        })(),
        (async () => {
            const { data } = await axios.get("http://localhost:3000/orders");
            appendText(JSON.stringify(data[0]));
        })()]);
}
