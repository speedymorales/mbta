import axios from "axios";

interface Prediction {
  stop: string;
  date: Date;
  direction: "Inbound" | "Outbound";
}

const main = async () => {
  const endpoint =
    "https://api-v3.mbta.com/predictions?filter[stop]=place-forhl&filter[direction_id]=1&filter[route_type]=1&include=stop";
  const res = await axios.get(endpoint);
  console.log(res.headers);

  const predictions: Prediction[] = [];

  const stop = res.data.included[0];
  res.data.data.forEach((pred: any) => {
    let dir: "Inbound" | "Outbound" = "Inbound";
    let dt: Date;
    if (pred.attributes.direction_id) {
      // North
      dt = new Date(pred.attributes.departure_time);
    } else {
      dir = "Outbound";
      dt = new Date(pred.attributes.arrival_time);
    }

    predictions.push({
      stop: stop.attributes.description,
      date: dt,
      direction: dir,
    });
  });

  predictions.sort((a, b) => {
    return a.date > b.date ? 1 : -1;
  });

  predictions.forEach((p) => {
    console.log(p.stop, p.date.toLocaleString(), p.direction);
  });
};

main();
