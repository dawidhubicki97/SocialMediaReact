import React, {useRef,useState} from 'react'
import {Form,Button,Card,Alert} from 'react-bootstrap'
import {useAuth} from '../contexts/AuthContext'
import {Link,useHistory} from 'react-router-dom'


export default function SignUp() {

    const emailRef=useRef()
    const usernameRef=useRef()
    const passwordRef=useRef()
    const passwordConfirmRef=useRef()
    const {signup} = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const history=useHistory()

    async function handleSubmit(e){
        e.preventDefault()
        if(passwordRef.current.value!==passwordConfirmRef.current.value)
        {
            return setError('Hasla sie rożnią')
        }
        if(usernameRef.current.length>19){
            return setError('Nazwa użytkownka jest zbyt długa')
        }
        try{
            setError('')  
            setLoading(true)
            await signup(emailRef.current.value,passwordRef.current.value,usernameRef.current.value)
            history.push('/')
        }
        catch{
            setError('Nie udało się stworzyć konta')  
        }
        setLoading(false)
        
    }



    return (
        <div>
            <Card>
                <Card.Body>
     
                    <h2 className="text-center mb-4">Zarejestruj się</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Card.Body>
                <Form onSubmit={handleSubmit}>
                     <Form.Group id="username">
                        <Form.Label>Nazwa użytkownika</Form.Label>
                        <Form.Control type="username" ref={usernameRef} required />
                    </Form.Group>
                    <Form.Group id="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" ref={emailRef} required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label>Hasło</Form.Label>
                        <Form.Control type="password" ref={passwordRef} required />
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label>Powtórz hasło</Form.Label>
                        <Form.Control type="password" ref={passwordConfirmRef} required />
                    </Form.Group>
                    <Button type="submit" disabled={loading} className="w-100">Zarejestruj się</Button>
                </Form>
            </Card>
            <div className="w-100 text-center mt-2">
                Masz już konto?<Link to='/login'>Zaloguj się</Link>
            </div>
        </div>
    )
}
