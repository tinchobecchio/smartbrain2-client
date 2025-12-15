import Tilt from 'react-parallax-tilt';
import './Logo.css'
import brain from './brain.png'


const Logo = () => {
    return (
        <div className="ma5 mt0">
            <Tilt style={{width: '120px', textAlign: 'center'}}
                perspective={500}
                glareEnable={true}
                glareMaxOpacity={0.45}
                scale={1.05}
                className='shadow-5 Tilt'
            >
                <div style={{ height: '100px', alignContent: 'center'}}>
                    <img src={brain} alt='brain'/>
                </div>
            </Tilt>  
        </div>
    );
};

export default Logo;