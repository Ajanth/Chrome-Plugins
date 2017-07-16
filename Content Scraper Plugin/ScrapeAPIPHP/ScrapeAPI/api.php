<?php
 	require_once("Rest.inc.php");
	require_once('phpmailer/PHPMailerAutoload.php');
	class API extends REST {
	
		public $data = "";
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',406); // If the method does not exist with in this class "Page not found".
		}
				
		private function sendMail(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
					
			$mail_to = $this->_request['mailto'];
			$mail_from = $this->_request['fromemail'];
			
			$subject = $this->_request['subject'];
			$message = $this->_request['message'];
			
			$smtp_host = $this->_request['host'];
			$smtp_secureType = $this->_request['selectedSecurity'];
			$smtp_port = $this->_request['port'];
			
			$username = $this->_request['username'];
			$password = $this->_request['password'];
			
			$this->sendMailNow($mail_to,$mail_from,$subject,$message,$smtp_host,$smtp_secureType,$smtp_port,$username,$password);
			
			
		}
		
		private function sendMailNow($mail_to,$mail_from,$subject,$message,$smtp_host,$smtp_secureType,$smtp_port,$username,$password){

			$mail = new PHPMailer;
			$mail->isSMTP();
			$mail->Host =  $smtp_host;
			$mail->SMTPAuth = true;
			$mail->Username = $username;
			$mail->Password = $password;
			$mail->SMTPSecure = $smtp_secureType;//'tls';
			//$mail->SMTPDebug = 1;			
			$mail->Port = $smtp_port;//587;                                    //Set the SMTP port number - 587 for authenticated TLS
			$mail->setFrom($mail_from);
			$mail->addAddress($mail_to);
			//$mail->WordWrap = 50;  
			
			$mail->Subject = $subject;//'Here is the subject';
			$mail->Body    = $message;//'This is the HTML message body <b>in bold!</b>';
			$mail->AltBody = $message;//'This is the body in plain text for non-HTML mail clients';

			if(!$mail->send()) {
			   $this->response($this->json('Message could not be sent. Mailer Error: ' . $mail->ErrorInfo), 500);
			} else{
			   $this->response($this->json('SUCCESS'),200);
			}
		}
		
	// Initiiate Library
	private function json($data){
			return json_encode($data);
		}
	}
	$api = new API;
	$api->processApi();
?>
		