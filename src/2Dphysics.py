import numpy as np

class DynObject2DLog:

    def __init__(self,obj,bufferSize=100):
        self.obj = obj
        self.logCount = 0
        self.bufferSize = bufferSize
        self.data = np.zeros((9,self.bufferSize),dtype=np.float64) #posX,posY,velX,velY,accX,accY,aPos,aVel,aAcc

    def update(self):
        
        self.logCount += 1

        self.data[0:2,self.logCount] = self.obj.pos
        self.data[2:4,self.logCount] = self.obj.vel
        self.data[4:6,self.logCount] = self.obj.acc
        self.data[6,self.logCount] = self.obj.aPos
        self.data[7,self.logCount] = self.obj.aVel
        self.data[8,self.logCount] = self.obj.aAcc

        #extend np array if full
        if self.logCount % self.bufferSize == 0:
            self.data = np.append(self.data,np.zeros((9,self.bufferSize)))


class DynObject2D:

    def setState(self, *newState):
        """
        Sets state of self. State must be fed as 9 arguments in the following order: 
        posX,posY,velX,velY,accX,accY,angular pos, angular vel, angular acc.
        """
        if len(newState) != 9:
            msg = f"Cannot set state. {len(newState)} state variables given instead of 9."
            raise IndexError(msg)
        
        self.log.data[:,self.log.logCount] = newState
        self.pos = np.array(newState[0:2]).astype(np.float64)
        self.vel = np.array(newState[2:4]).astype(np.float64)
        self.acc = np.array(newState[4:6]).astype(np.float64)
        self.aPos,self.aVel,self.aAcc = np.array(newState[6:9]).astype(np.float64)

    def getState(self, count=0):
        """
        Gets object state stored in its log. 
        count: access previous log values.
        """
        if count > self.log.logCount:
            msg = f"No data before t=0! (count={count})"
            raise IndexError(msg)
        elif count < 0:
            msg = f"No data in the future! (count={count})"
            raise IndexError(msg)
        
        return self.log.data[:,self.log.logCount-count]

    def setPos(self,posX,posY):
        """
        Sets position of self.
        """
        self.log.data[0:2,self.log.logCount] = (posX,posY)
        self.pos = np.array((posX,posY)).astype(np.float64)

    def setVel(self,velX,velY):
        """
        Sets velocity of self.
        """
        self.log.data[2:4,self.log.logCount] = (velX,velY)
        self.vel = np.array((velX,velY)).astype(np.float64)

    def setAcc(self,accX,accY):
        """
        Sets velocity of self.
        """
        self.log.data[4:6,self.log.logCount] = (accX,accY)
        self.acc = np.array((accX,accY)).astype(np.float64)

    def setAngState(self,aPos,aVel,aAcc):
        self.data[6:9] = (aPos,aVel,aAcc) 
        self.aPos,self.aVel,self.aAcc = np.array((aPos,aVel,aAcc)).astype(np.float64)

    

    def __init__(self,initState=np.zeros(9,dtype=np.float64),bufferSize=100):
        """
        Creates base 2D object with initial position and velocity as arguments.
        State must be fed as 9 arguments in the following order: 
        posX,posY,velX,velY,accX,accY,angular pos, angular vel, angular acc.
        """
        self.pos,self.vel,self.acc = np.reshape(initState[0:6],(3,2))
        self.aPos,self.aVel,self.aAcc = initState[6:9]
        self.log = DynObject2DLog(self,bufferSize)

    def move(self,dt=1):
        """
        Moves self according to its state.
        """
        self.pos += self.vel*dt+0.5*self.acc*dt**2
        self.vel += self.acc*dt
        self.aPos += self.aVel*dt+0.5*self.aAcc*dt**2
        self.aVel += self.aAcc*dt
        
        self.log.update()

if __name__ == "__main__":
    testObj = DynObject2D()
    testObj.setState(0,0,1,0,0,0,0,0,0)
    print(testObj.getState())

    testObj.setAcc(1,0)
    print(testObj.getState())
    testObj.move(1)
    print(testObj.getState())
    testObj.setVel(-1,0)
    print(testObj.getState())
    testObj.move(1)
    print(testObj.getState())