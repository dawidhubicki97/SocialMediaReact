import React, {useRef,useState} from 'react'
import {Form,Button,Card,Alert} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {Link,useHistory} from 'react-router-dom'


export default function Login() {

    const emailRef=useRef()
    const passwordRef=useRef()
    const {login} = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history=useHistory()

    async function handleSubmit(e){
        e.preventDefault()

        try{
            setError("")  
            setLoading(true)
            await login(emailRef.current.value,passwordRef.current.value)
            history.push('/')
            
        }
        catch{
            setError('Nie udało się zalogować')  
        }
        setLoading(false)
        
    }



    return (
        <div>
            <Card>
                <Card.Body>
     
                    <h2 className="text-center mb-4">Zaloguj się</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Hasło</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">Zaloguj się</Button>
                </Form>
            </Card>
            <div className="w-100 text-center mt-2">
                Nie masz konta?<Link to='/signup'>Zarejestruj się</Link>
            </div>
        </div>
    )
}
