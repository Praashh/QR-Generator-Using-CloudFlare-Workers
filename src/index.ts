import qr from 'qr-image';

export interface Env {

}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext) {
			if(request.method === 'POST') {
				return generateQRCode(request);
			}

			return new Response(landing, {
				headers: {
					"Content-Type": "text/html"
				}
			})
	},
};

async function generateQRCode(request:any) {
  const { text } = await request.json();
	const headers = { "Content-Type": "image/png" }
  const qr_png = qr.imageSync(text || "praash");
	return new Response(qr_png, { headers });
}

const landing = `
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>QR code Generator using Cloudflare Workers</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			margin: 0;
			padding: 0;
			background-image: url("https://ideogram.ai/api/images/direct/3bZkP5xgQ3O2bJbb-BYo6g.jpg");
			background-repeat: no-repeat;
			background-size: cover;
			backdrop-filter: blur(10px);
		}

		h1 {
			text-align: center;
			color: white;
			font-weight: 900;
		}

		.container {
			height: 100vh;
			width: 100%;
			max-width: 600px;
			margin: 0 auto;
			padding: 20px;
			color: wheat;
			font-weight: 600;
		}

		.input-container {

			display: flex;
			align-items: center;
			margin-bottom: 10px;
		}

		.input-container input[type="text"] {
			flex: 1;
			padding: 5px;
			border: 1px solid #ccc;
			border-radius: 4px;
		}

		.input-container button {
			margin-left: 10px;
			padding: 5px 10px;
			background-color: #4CAF50;
			color: white;
			border: none;
			border-radius: 4px;
			cursor: pointer;
		}

		.generated-qr {
			text-align: center;
		}

		.generated-qr img {
			max-width: 100%;
			height: auto;
		}
		.qr-result {
			display:flex;
			flex-direction:column;
			text-align: center;
			color: #033053;
			font-size: 2rem;
			font-weight: 800;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>QR Generator</h1>
		<p>Click the below button to generate a new QR code. This will make a request to your Worker.</p>
		<div class="input-container">
			<input type="text" id="text" value="https://github.com/Praashh">
			<button onclick="generate()">Generate QR Code</button>
		</div>
		<p class="generated-qr">Generated QR Code Image</p>
		<div class="qr-result">
			 <span id="res-span"></span>
			 <img id="qr" src="">
		</div>
	</div>
	<script>
		function generate() {
			var resSpan = document.getElementById("res-span");
			resSpan.innerHTML = "Hurray!, Here's the QR code";
			fetch(window.location.pathname, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ text: document.querySelector("#text").value })
			})
			.then(response => response.blob())
			.then(blob => {
				const reader = new FileReader();
				reader.onloadend = function () {
					document.querySelector("#qr").src = reader.result; // Update the image source with the newly generated QR code
				}
				reader.readAsDataURL(blob);
			})
		}
	</script>
</body>
</html>

`
